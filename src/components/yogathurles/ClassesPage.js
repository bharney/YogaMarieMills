import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import landing from '../../images/landing.jpg';

class ClassesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <div className="container-fluid">
                
                <div className="row">
                    <div className="col-xs-offset-1 col-xs-10">
                        <h1 className="text-center">Yoga Thurles Classes Types</h1>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="half">
                        <img className="img-responsive" src={landing} />
                    </div>
                    <div className="half">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10 p-t-10 p-b-20 p-r-20 p-l-20 tile">
                                <h2>Morning Yoga</h2>
                                <p>Morning Yoga in Thurles has more benefits than most people realise.
                                    Morning Yoga allows a deeper removal of toxins from the body.
                                    Yoga is great for all body and mind types.
                                    Morning Yoga is ideal for correct breathing which can be integrated into our daily routine for stress relief.
                                    All of Yoga is ideal to begin and maintain weight loss, gaining flexibility and balance at the same time.
                                    When we move the body early, we are setting up a positive environment for the mind to start the day.
                                    The release of good feeling hormones after a warming Yoga practice will put a spring in your step, lightness
                                    in your mind, better judgement and your family and friends will no doubt comment on how you are beaming lately!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="half">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10 p-t-10 p-b-20 p-r-20 p-l-20 tile">
                                <h2>Teen Yoga</h2>
                                <p>Teen Yoga with Marie Mills tries to encourage all of us to slow down. We can use Yoga as a way to see how we relate
                                to everything in our life. Teen Yoga uses Yoga postures as a way of developing awareness, to increase strength,  balance
                                and flexibility, not just in the body but in the mind and emotions. Yoga postures, correct breathing, meditation, mindfulness
                                and relaxation all improve: circulation, digestion, postural alignment, higher brain function, self-confidence and self-esteem.
                                Teen Yoga with Yoga Thurles empowers the student to see and make choices in their own health and lifestyle.
                                Teen Yoga adds another level of education and awareness, you could even say it offers a new view to how life can be interpreted.</p>
                            </div>
                        </div>
                    </div>
                    <div className="half">
                        <img className="img-responsive" src={landing} />
                    </div>
                </div>
                <div className="row">
                    <div className="half">
                        <img className="img-responsive" src={landing} />
                    </div>
                    <div className="half">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10 p-t-10 p-b-20 p-r-20 p-l-20 tile">
                                <h2>Yoga for children</h2>
                                <p>Yoga postures to explore their connection to their environment as a whole, whether it is
                                through animals, nature, robots, current affairs, school, play, family life and even outerspace.
                                    mindfulness tools and what mindfulness is. awareness development including finding self
                                    awareness and awareness of others how to breathe better and why we should. how Yoga becomes
                                    a benefit to the body and what different postures do for us.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="half">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10 p-t-10 p-b-20 p-r-20 p-l-20 tile">
                                <h2>One-on-One Yoga Sessions</h2>
                                <p>Personal Yoga sessions are developed from the needs of the student. Each session and the information
                                given are built around the Ayurvedic and Yoga view. This involves all the varying factors of the students life.
                                Most importantly, we look at the individuals body and mind type, your lifestyle, work, stress levels, nutrition,
                                activity and what steps you are would like to take to integrate Yoga into a daily routine.</p>
                            </div>
                        </div>
                    </div>
                    <div className="half">
                        <img className="img-responsive" src={landing} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassesPage;


