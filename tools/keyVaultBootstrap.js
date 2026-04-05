import dotenv from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

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

    const credential = new DefaultAzureCredential();
    const client = new SecretClient(vaultUrl, credential);

    for (const mapping of requiredMappings) {
        const secretName = process.env[mapping.secretNameKey] || mapping.defaultSecretName;

        try {
            const secret = await client.getSecret(secretName);
            process.env[mapping.envKey] = secret.value;
        } catch (error) {
            throw new Error(`Failed to load '${mapping.envKey}' from Key Vault secret '${secretName}': ${error.message}`);
        }
    }
}
