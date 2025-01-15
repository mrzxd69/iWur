declare module "bun" {
    interface Env {
        TELEGRAM_BOT_TOKEN: string;
        APP_ID: string;
        APP_HASH: string;
        DATABASE_URL: string;
        ARTICLE: string;
    }
}