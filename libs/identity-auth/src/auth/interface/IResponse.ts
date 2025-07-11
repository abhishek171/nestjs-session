
export interface ICreateTokenResponse{
    accessToken:string;
    refreshToken:string;
}

export interface IRefreshTokenResponse {
    id:number;
    accessToken:string;
}

export interface IVerifyTokenResponse{
  user: { id: number};
}
