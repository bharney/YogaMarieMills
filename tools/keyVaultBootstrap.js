import dotenv from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import path from 'path';

dotenv.config();

const requiredMappings = [
    { envKey: 'DATABASE_URL', secretNameKey: 'KEYVAULT_DATABASE_URL_SECRET', defaultSecretName: 'DATABASE-URL' },
    { envKey: 'JWT_SECRET', secretNameKey: 'KEYVAULT_JWT_SECRET_NAME', defaultSecretName: 'JWT-SECRET' }
];

function getVaultUrl() {
    if (process.env.AZURE_KEY_VAULT_URL) {
        return process.env.AZURE_KEY_VAULT_URL;
    }

    if (process.env.AZURE_KEY_VAULT_NAME) {
        return `https://${process.env.AZURE_KEY_VAULT_NAME}.vault.azure.net`;
    }

    return null;
}

export async function bootstrapKeyVaultSecrets() {
    const vaultUrl = getVaultUrl();

    if (!vaultUrl) {
        return;
    }

    try {
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(vaultUrl, credential);

        console.log(`Key Vault: loading secrets from ${vaultUrl}`);

        for (const mapping of requiredMappings) {
            const secretName = process.env[mapping.secretNameKey] || mapping.defaultSecretName;

            try {
                const secretValue = await client.getSecret(secretName);
                process.env[mapping.envKey] = secretValue.value;
                console.log(`Key Vault: loaded '${mapping.envKey}' from secret '${secretName}'`);
            } catch (error) {
                const msg = `Key Vault: failed to load '${mapping.envKey}' from secret '${secretName}' in vault '${vaultUrl}': ${error.message}`;
                console.error(msg);
                if (error.stack) console.error(error.stack);
                throw new Error(msg);
            }
        }

        // Patch the cached secrets module so that `import { secret }` in controllers
        // reflects the Key Vault value, not the stale module-load-time value.
        try {
            const secretsPath = path.resolve(__dirname, '../secrets');
            const secretsMod = require(secretsPath);
            secretsMod.secret = process.env.JWT_SECRET;
            secretsMod.default = process.env.JWT_SECRET;
        } catch (_) {
            // non-fatal — controllers loaded after this point will use process.env directly
        }

        console.log('Key Vault: bootstrap complete.');
    } catch (error) {
        const msg = `Key Vault bootstrap failed: ${error.message || error}`;
        console.error(msg);
        if (error && error.stack) {
            console.error(error.stack);
        }
        throw new Error(msg);
    }
}
