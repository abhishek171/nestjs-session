import { User } from "src/repository/models/User.model";

export interface IUserOperationSuccessResponse{
    message:string;
}

export interface IUserTokenResponse{
    accessToken:string;
}

export interface ICloudinaryResponse{
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export type TUserResponse = Omit<User['dataValues'], 'accessToken' | 'refreshToken' | 'password'>;

export interface IUserResponse {
  user: TUserResponse;
  message:string
}

export interface IProfileImageUpdateResponse {
  profileImage: string;
}

