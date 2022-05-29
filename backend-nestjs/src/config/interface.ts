export interface DatabaseConfig {
    mysql: MySqlConfig;
}

export interface MySqlConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}
