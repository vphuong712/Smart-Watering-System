import './SwitchToggle.css';

const SwitchToggle = (props) => {

    return <>
        <label className='switch'>
            <input type="checkbox" onClick={props.click} />
            <span className='slider round'></span>
        </label>
    </>
}

export default SwitchToggle;