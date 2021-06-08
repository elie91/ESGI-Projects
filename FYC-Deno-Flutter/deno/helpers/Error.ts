const formatError = (e: any) => {

    const errors = Object.entries(e)[0][1];
    // @ts-ignore
    return errors.message;
}

export {formatError};
