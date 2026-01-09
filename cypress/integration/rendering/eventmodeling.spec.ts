import { imgSnapshotTest } from '../../helpers/util.ts';

describe('eventmodeling diagram', () => {
  it('should render a simple eventmodeling diagram', () => {
    imgSnapshotTest(
      `eventmodeling
        system Cart {
          event ItemAdded
        }
        
        screen CartScreen
        command AddItem
        readmodel CartItems
        
        CartScreen --> AddItem
        AddItem --> ItemAdded
        ItemAdded --> CartItems
      `
    );
  });

  it('should render an eventmodeling diagram with title and accessibility', () => {
    imgSnapshotTest(
      `eventmodeling
        title Shopping Cart Flow
        accTitle: Shopping Cart Accessibility Title
        accDescr: A shopping cart event modeling diagram
        
        system Cart {
          event ItemAdded
          event CartCleared
        }
        
        screen CartScreen
        command AddItem
        readmodel CartItems
        
        CartScreen --> AddItem
        AddItem --> ItemAdded
        ItemAdded --> CartItems
      `
    );
  });

  it('should render an eventmodeling diagram with data parameters', () => {
    imgSnapshotTest(
      `eventmodeling
        system Cart {
          event ItemAdded (productId quantity)
          event ItemRemoved (itemId)
        }
        
        screen CartScreen
        command AddItem (productId)
        command RemoveItem (itemId)
        readmodel CartItems (items total)
        
        CartScreen --> AddItem
        AddItem --> ItemAdded
        ItemAdded --> CartItems
        CartScreen --> RemoveItem
        RemoveItem --> ItemRemoved
        ItemRemoved --> CartItems
      `
    );
  });

  it('should render an eventmodeling diagram with titles', () => {
    imgSnapshotTest(
      `eventmodeling
        system Cart [Shopping Cart System] {
          event ItemAdded (productId)
          event CartCleared
        }
        
        screen CartScreen [Cart View]
        command AddItem (productId) [Add Item Command]
        readmodel CartItems [Cart Items View]
        processor OrderProcessor [Order Processing Service]
        
        CartScreen --> AddItem
        AddItem --> ItemAdded
        ItemAdded --> CartItems
        ItemAdded --> OrderProcessor
      `
    );
  });

  it('should render an eventmodeling diagram with multiple systems', () => {
    imgSnapshotTest(
      `eventmodeling
        system Cart {
          event ItemAdded
          event CartCleared
        }
        
        system Inventory {
          event InventoryChanged
          event StockDepleted
        }
        
        system Order {
          event OrderPlaced
          event OrderShipped
        }
        
        screen CartScreen
        command AddItem
        readmodel CartItems
        
        CartScreen --> AddItem
        AddItem --> ItemAdded
        ItemAdded --> InventoryChanged
        InventoryChanged --> CartItems
      `
    );
  });

  it('should render an eventmodeling diagram with processors', () => {
    imgSnapshotTest(
      `eventmodeling
        system User {
          event UserRegistered
          event EmailVerified
        }
        
        system Notification {
          event EmailSent
        }
        
        screen RegistrationScreen
        command RegisterUser
        processor EmailProcessor
        readmodel UserProfile
        
        RegistrationScreen --> RegisterUser
        RegisterUser --> UserRegistered
        UserRegistered --> EmailProcessor
        EmailProcessor --> EmailSent
        UserRegistered --> UserProfile
      `
    );
  });

  it('should render a complex eventmodeling diagram', () => {
    imgSnapshotTest(
      `eventmodeling
        title Order Processing System
        
        system Order {
          event OrderPlaced
          event OrderShipped
          event OrderDelivered
        }
        
        system Payment {
          event PaymentProcessed
          event PaymentFailed
        }
        
        system Inventory {
          event InventoryReserved
          event InventoryReleased
        }
        
        screen CheckoutScreen
        command PlaceOrder
        command ProcessPayment
        readmodel OrderHistory
        readmodel PaymentStatus
        readmodel InventoryStatus
        processor ShippingProcessor
        processor InventoryProcessor
        
        CheckoutScreen --> PlaceOrder
        PlaceOrder --> OrderPlaced
        OrderPlaced --> InventoryProcessor
        InventoryProcessor --> InventoryReserved
        InventoryReserved --> ProcessPayment
        ProcessPayment --> PaymentProcessed
        PaymentProcessed --> ShippingProcessor
        ShippingProcessor --> OrderShipped
        OrderShipped --> OrderDelivered
        OrderDelivered --> OrderHistory
        PaymentProcessed --> PaymentStatus
        InventoryReserved --> InventoryStatus
      `
    );
  });

  it('should render an eventmodeling diagram with circular flow', () => {
    imgSnapshotTest(
      `eventmodeling
        system Simple {
          event ActionCompleted
        }
        
        screen MainScreen
        command DoAction
        readmodel Result
        
        MainScreen --> DoAction
        DoAction --> ActionCompleted
        ActionCompleted --> Result
        Result --> MainScreen
      `
    );
  });

  it('should render an eventmodeling diagram with all entity types', () => {
    imgSnapshotTest(
      `eventmodeling
        title Complete Example
        
        system Authentication {
          event UserLoggedIn (userId sessionId)
          event LoginFailed (reason)
        }
        
        system Notification {
          event NotificationSent (userId message)
        }
        
        screen LoginScreen [User Login Page]
        command AuthenticateUser (username password) [Authenticate User Command]
        readmodel UserSession (sessionId expiry) [Active User Session]
        processor NotificationProcessor [Notification Service]
        
        LoginScreen --> AuthenticateUser
        AuthenticateUser --> UserLoggedIn
        UserLoggedIn --> UserSession
        UserSession --> LoginScreen
        UserLoggedIn --> NotificationProcessor
        NotificationProcessor --> NotificationSent
      `
    );
  });

  it('should render an eventmodeling diagram with minimal entities', () => {
    imgSnapshotTest(
      `eventmodeling
        system Test {
          event TestEvent
        }
        
        screen TestScreen
        command TestCommand
        
        TestScreen --> TestCommand
        TestCommand --> TestEvent
      `
    );
  });

  it('should render an eventmodeling diagram with only events', () => {
    imgSnapshotTest(
      `eventmodeling
        system SystemA {
          event EventA1
          event EventA2
        }
        
        system SystemB {
          event EventB1
        }
      `
    );
  });
});
