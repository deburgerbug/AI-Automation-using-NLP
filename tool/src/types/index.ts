
export interface User{
    id: string,
    email: string;
    name?: string,
    cretedAt: string;
}

export interface Test {
    id: string,
    test: string,
    naturalLanguage: string,
    generatedCode: string,
    status: TestStatus,
    createdAt: string,
    updatedAt: string
}
export type TestStatus = 'DRAFT' | 'READY' | 'DEPRECATED'

export interface ExecutionResult {
    id: string,
    techId: string,
    status: ExecutionStatus,
    duration: number,
    screenshots: string[],
    startedAt: string,
    completedAt: string
}
export type ExecutionStatus = 'PENDING' | 'RUNNNING' | 'PASSED' | 'FAILED' | 'TIMEOUT';

export interface ApiResponse<T> {
    data?: T,
    error?: string,
    message?: string
}