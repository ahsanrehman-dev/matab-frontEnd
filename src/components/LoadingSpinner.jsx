import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    size = 'medium',
    color = 'primary',
    text = '',
    overlay = false,
    fullScreen = false
}) => {
    const spinnerClass = `loading-spinner ${size} ${color} ${overlay ? 'overlay' : ''} ${fullScreen ? 'fullscreen' : ''}`;

    return (
        <div className={spinnerClass}>
            <div className="spinner-container">
                <div className="spinner" aria-hidden="true"></div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
    overlay: PropTypes.bool,
    fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
