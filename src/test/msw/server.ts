import { setupServer } from 'msw/node';

import { handlers } from '../../mocks/handlers';

// Setup server with all handlers for testing
export const server = setupServer(...handlers);
