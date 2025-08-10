export interface IQuestion {
  _id?: string;
  competency: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  questionText: string;
  options: string[];
  correctAnswer: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionRequest {
  competency: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  id: string;
}

export interface QuestionsResponse {
  success: boolean;
  data: IQuestion[];
  message?: string;
  pagination: {
    total: number;
    page: number;
    pages: number;
  }
}

export interface QuestionResponse {
  success: boolean;
  data: IQuestion;
  message?: string;
}

export interface DeleteQuestionResponse {
  success: boolean;
  message: string;
} 

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  competency?: string;
  sortBy?: 'createdAt' | 'level' | 'competency';
}
