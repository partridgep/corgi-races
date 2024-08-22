import './LoadingCorgi.css'
// import { ReactComponent as SmilingCorgi } from '../../public/smiling-mouth-of-a-corgi-from-the-side (1).svg'
import { ReactComponent as CorgiEyes } from '../../public/corgi-eyes.svg'
// import { ReactComponent as CorgiMouth } from '../../public/corgi-mouth.svg'
export const LoadingCorgi = () => {

    return (
        <div>
            {/* <SmilingCorgi /> */}
            <div className="loop-wrapper">
                <p className='text-center italic font-semibold animate-pulse mt-10 text-sm pr-16'>Loading...</p>
                <div className='corgi-container'>
                    <div className='corgi-body'>
                        <div className='legs rear'>
                            <div className='behind'></div>
                            <div className='close'></div>
                        </div>
                        <div className='legs front'>
                            <div className='behind shadow-lg'></div>
                            <div className='close shadow-lg'></div>
                        </div>
                        <div className="torso"></div>
                        <div className='head '>
                            <div className='snout'></div>
                            <div className='snout-nose'></div>
                            <div className='snout-top'>
                        </div>
                            {/* <div className='eye-left'>
                                <div className='eyebrow-left'></div>
                            </div> */}
                            {/* <div className='eye-right'></div> */}
                            <div className='ears '>
                                <div className='ear-left '></div>
                                <div className='ear-right'></div>
                            </div>
                            <div className='face'></div>
                            <CorgiEyes className='corgi-eyes' />
                            {/* <CorgiMouth className='corgi-mouth' /> */}
                            {/* <div className="mouth"></div> */}
                        </div>
                        {/* <div className='tail'></div> */}
                    </div>
                </div>
                <div className='floor border border-gray-500 dark:border-white'></div>
            </div> 
        </div>
    );
}