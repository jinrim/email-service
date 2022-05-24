export default interface IEnvConfig {
  service_id: number;
  port: number;
  basic_auth_username: string;
  basic_auth_password: string;
  redis_http_host: string;
  default_email_to: string;
  default_email_from: string;
  sendgrid_api_key: string;
  schema_version: string;
  app_environment: string;
  graphql_endpoint_timeline: string;
  enable_restrictions: string;
  error_log_web_hook_url: string;
  gql_debug: string;
  gql_playground: string;
  [key: string]: any;
}
