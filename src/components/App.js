<<<<<<< HEAD
import React, { PropTypes } from 'react';
import Header from './common/Header';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Header />
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.object.isRequired
};

export default App;
=======
import React, {PropTypes} from 'react';
import Header from './common/Header';


class App extends React.Component {
    constructor(props) {
        super(props);
    }
  render() {
    return (
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
            <Header/>
            <main className="mdl-layout__content">
              
                            {this.props.children}
               
            </main>
        </div> 
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596
