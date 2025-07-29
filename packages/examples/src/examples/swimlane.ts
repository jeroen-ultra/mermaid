import type { DiagramMetadata } from '../types.js';

export default {
  id: 'swimlane',
  name: 'Swimlane',
  description: 'Horizontal swimlane flow diagrams for system interactions',
  examples: [
    {
      title: 'Basic Swimlane Diagram',
      isDefault: true,
      code: `swimlane
    lane "Frontend System"
        A[User Request] --> B[Validate Input]
    end
    lane "Backend System"
        B --> C[Process Request]
        C --> D[Business Logic]
    end
    lane "Database System"
        D --> E[Query Database]
        E --> F[Return Results]
    end`,
    },
    {
      title: 'Cross-Lane Communication',
      code: `swimlane
    lane "User Interface"
        A[Login Form] --> B[Submit Credentials]
    end
    lane "Authentication Service"
        B --> C[Validate User]
        C --> D[Generate Token]
    end
    lane "User Management"
        D --> E[Update Last Login]
    end
    lane "Response"
        E --> F[Return Success]
    end`,
    },
    {
      title: 'Simple Process Flow',
      code: `swimlane
    lane "Customer"
        A[Place Order] --> B[Receive Confirmation]
    end
    lane "Order System"
        A --> C[Process Payment]
        C --> D[Update Inventory]
    end
    lane "Fulfillment"
        D --> E[Ship Order]
        E --> B
    end`,
    },
  ],
} satisfies DiagramMetadata;