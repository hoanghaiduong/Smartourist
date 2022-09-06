export const createError=(status,message)=>{
    return {
        status:status,
        message:message
    };
    // const error=new Error(message);
    // error.status=status;
    // return error;
}