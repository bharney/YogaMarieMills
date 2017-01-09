import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';

class WhatToBringPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <div className="mdl-grid dark-color bg-color">
                <div className="ribbon bright-bg-color">
                    <div id="about" div className="mdl-card container m-t-30 m-b-30 mdl-shadow--4dp">
                        <div className="featured clearfix text-center">
                            <h1>What to Bring?</h1>
                            <div className="row">
                                <div className="col-xs-offset-1 col-xs-10">
                                    <div className="col-xs-12 text-left">

                                        <h3>What to bring to Yoga with Marie Mills?
                                            You will need to wear comfortable loose clothing, such as track suit pants and t-shirt.
                                            A small bottle of water.
                                            A blanket or towel in the winter to provide warmth for the relaxation and meditation.
                                            An open mind and awareness to just this moment.
                                            The Yoga room on Baker street, Thurles, provides :
                                            Yoga mats are available in the room (however you are encouraged to bring your own for your comfort and hygeine.)
                                            bolsters for meditation, mindfulness and relaxation
                                            optional chairs for mindful Yoga for those who need more support
                                            blankets are available.</h3>
                                        <h3>Inquiries are welcome. Please contact Marie at 086-1778369</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WhatToBringPage;


