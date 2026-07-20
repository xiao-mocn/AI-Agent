import 'dotenv/config'
import { config } from '../src/utils/config'

console.info(
  `[config-check] ${config.NODE_ENV} configuration is valid on port ${config.PORT}`,
)