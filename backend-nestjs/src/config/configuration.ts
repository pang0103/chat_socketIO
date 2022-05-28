import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'config-prod.yml';
        case 'development':
            return 'config-dev.yml';
        default:
            throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
    }
};

export default () => {
    return yaml.load(
        readFileSync(join(__dirname, YAML_CONFIG_FILENAME()), 'utf8'),
    ) as Record<string, any>;
};
