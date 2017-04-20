import React from 'react';

class WhatToBringPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <div className="mdl-grid dark-color bg-color">
                <div className="container-fluid p-3-em p-l-0 p-r-0 color-blur">
                    <div className="ribbon bg-image-landing b-border">
                        <div className="container-fluid">
                            <h1 className="text-center color-white p-b-025-em">What to Bring?</h1>
                            <div className="row p-b-15 m-t-1-em m-b-1-em">
                                <div className="col-sm-offset-1 col-sm-10 col-xs-12 p-b-15 m-b-1-em">
                                    <div className="mdl-card mdl-shadow--4dp p-3-em text-center allow-overflow">
                                        <div className="icon-circle-sm stretch mdl-pos-rel bg-color-green mdl-shadow--4dp m-t--80"></div>
                                        <h3 className="text-center">The Yoga room on Baker street, Thurles provides the following:</h3>
                                        <ul className="mdl-list p-20">
                                            <li>
                                                <p>Yoga mats are available in the room (however you are encouraged to bring your own for your comfort and hygeine).</p>
                                            </li>
                                            <li>
                                                <p>bolsters for meditation, mindfulness and relaxation.</p>
                                            </li>
                                            <li>
                                                <p>optional chairs for mindful Yoga for those who need more support.</p>
                                            </li>
                                            <li>
                                                <p>blankets are available.</p>
                                            </li>
                                        </ul>
                                        <div className="row">
                                            <div className="col-md-offset-1 col-sm-4 col-md-2 col-xs-12 wtb-items">
                                                <div><i className="icon-circle-sm mdl-shadow--4dp clothing bright-bg-color"></i></div>
                                                <p>You will need to wear comfortable loose clothing, such as track suit pants and t-shirt.</p>
                                            </div>
                                            <div className="col-sm-4 col-md-2 col-xs-12 wtb-items">
                                                <div><i className="icon-circle-sm mdl-shadow--4dp yogamat bg-color-purple"></i></div>
                                                <p>We strongly suggest you bring your own Yoga mat.</p>
                                            </div>
                                            <div className="col-sm-4 col-md-2 col-xs-12 wtb-items">
                                                <div><i className="icon-circle-sm mdl-shadow--4dp waterbottle bg-color-pink"></i></div>
                                                <p>Its recommended that you bring small bottle of water.</p>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-xs-12 wtb-items">
                                                <div><i className="icon-circle-sm mdl-shadow--4dp towel bg-color-yellow"></i></div>
                                                <p>If you sweat we suggest a towel. Or in the winter, a blanket to provide warmth for the relaxation and meditation.</p>
                                            </div>
                                            <div className="col-sm-6 col-md-2 col-xs-12 wtb-items">
                                                <div><i className="icon-circle-sm mdl-shadow--4dp mind bg-color-green"></i></div>
                                                <p>An open mind and awareness to just this moment.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-center">Inquiries are welcome. Please contact Marie at 086-1778369</h3>
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