
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

const sharedFailures = () =>
  applyDecorators(
    ApiInternalServerErrorResponse({
      example: {
        statusCode: 500,
        message: 'Something went wrong',
        error: 'Internal Server Error',
      },
    }),
    ApiServiceUnavailableResponse({
      example: {
        statusCode: 503,
        message: 'Database Error',
        error: 'Service Unavailable',
      },
    }),
  );

export function SwaggerRegisterUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiBadRequestResponse({
      example: {
        statusCode: 400,
        message: 'Invalid input',
        error: 'Bad Request',
      },
    }),
    ApiConflictResponse({
      example: {
        statusCode: 409,
        message: 'User Already Exist',
        error: 'Conflict',
      },
    }),
    sharedFailures()
  );
}

export function SwaggerLoginUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiResponse({ status: 200, description: 'Returns access token' }),
    ApiBadRequestResponse({
      example: {
        statusCode: 400,
        message: 'Invalid input',
        error: 'Bad Request',
      },
    }),
    ApiNotFoundResponse({
      example: {
        statusCode: 404,
        message: 'User Not Found',
        error: 'Not Found',
      },
    }),
    sharedFailures()
  );
}

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate new access token' }),
    ApiResponse({ status: 200, description: 'Returns new access token' }),
    ApiNotFoundResponse({
      example: {
        statusCode: 404,
        message: 'User Not Found',
        error: 'Not Found',
      },
    }),
    sharedFailures()
  );
}

export function SwaggerUserRoutes(summary: string, successDescription: string) {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: successDescription }),
    ApiNotFoundResponse({
      example: {
        statusCode: 404,
        message: 'User Not Found',
        error: 'Not Found',
      },
    }),
    sharedFailures()
  );
}

export function SwaggerProfilePicUpload() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary: 'Upload profile picture' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Profile picture uploaded' }),
    ApiNotFoundResponse({
      example: {
        statusCode: 404,
        message: 'User Not Found',
        error: 'Not Found',
      },
    }),
    sharedFailures()
  );
}
