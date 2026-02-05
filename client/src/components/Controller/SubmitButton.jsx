// Submit button component

import './SubmitButton.css';

export function SubmitButton({ onClick, disabled, hasChanges }) {
    return (
        <button
            className={`submit-button ${hasChanges ? 'has-changes' : ''}`}
            onClick={onClick}
            disabled={disabled || !hasChanges}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span>Submit Queue</span>
        </button>
    );
}
