import { ErrorHandler } from './../errorHandler';

export class TestErrorHandler implements ErrorHandler {
    private _errors: string[] = [];

    handleError(errorMessage: string) {
        this._errors.push(errorMessage);
    }

    getErrors(): string[] {
        return this._errors;
    }

    reset(): void {
        this._errors = [];
    }
}
