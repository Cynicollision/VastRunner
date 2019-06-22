export interface ErrorHandler {
    handleError(errorMessage: string): void;
}

export class DefaultErrorHandler implements ErrorHandler {
    handleError(errorMessage: string): void {
        console.log(errorMessage);
    }
}