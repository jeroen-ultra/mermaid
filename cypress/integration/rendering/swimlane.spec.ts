import { imgSnapshotTest, renderGraph } from '../../helpers/util.ts';

describe('Swimlane Diagrams', () => {
  it('should render a basic swimlane diagram', () => {
    imgSnapshotTest(
      `swimlane
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
      { fontFamily: 'courier' }
    );
  });

  it('should render cross-lane communication', () => {
    imgSnapshotTest(
      `swimlane
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
      { fontFamily: 'courier' }
    );
  });

  it('should render simple process flow', () => {
    imgSnapshotTest(
      `swimlane
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
      { fontFamily: 'courier' }
    );
  });

  it('should handle empty lanes', () => {
    imgSnapshotTest(
      `swimlane
        lane "Active System"
            A[Process A] --> B[Process B]
        end
        lane "Inactive System"
        end
        lane "Another System"
            C[Process C]
        end`,
      { fontFamily: 'courier' }
    );
  });

  it('should render single lane diagram', () => {
    imgSnapshotTest(
      `swimlane
        lane "Single System"
            A[Start] --> B[Process] --> C[End]
        end`,
      { fontFamily: 'courier' }
    );
  });

  it('should handle complex cross-lane connections', () => {
    imgSnapshotTest(
      `swimlane
        lane "System A"
            A1[Node A1] --> A2[Node A2]
        end
        lane "System B"
            A1 --> B1[Node B1]
            B1 --> A2
        end
        lane "System C"
            B1 --> C1[Node C1]
        end`,
      { fontFamily: 'courier' }
    );
  });
});