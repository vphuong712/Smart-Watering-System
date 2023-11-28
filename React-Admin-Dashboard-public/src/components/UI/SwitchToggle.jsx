import './SwitchToggle.css';

const SwitchToggle = (props) => {

    return <>
        <label className='switch'>
            <input type="checkbox" onClick={props.click} disabled={props.disabled}  />
            <span className='slider round'></span>
        </label>
    </>
}

export default SwitchToggle;