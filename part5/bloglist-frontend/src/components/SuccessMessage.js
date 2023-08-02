const SuccessMessage = ({ message }) => {
    if (message === null) {
        return
    }

    return (
        <div className="success">
            {message}
        </div>
    )
}

export default SuccessMessage