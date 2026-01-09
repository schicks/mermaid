# Event Modeling Diagram

> Event Modeling is a method of describing systems using an example of how information has changed within them over time. It is a visual technique that shows the flow of commands, events, and read models in a system, organized by time and system boundaries.

Event Modeling diagrams in Mermaid visualize system behavior using:

- **Systems**: Logical groupings that contain related events
- **Entities**: Screens, Processors, Commands, Read Models, and Events
- **Relationships**: Arrows showing the flow between entities
- **Timeline**: Left-to-right flow showing the sequence of operations

Reference: [Event Modeling](https://eventmodeling.org/)

## Example

```mermaid-example
eventmodeling
    title Shopping Cart Flow

    system Cart {
      event ItemAdded (productId)
      event ItemRemoved (itemId)
      event CartCleared
    }

    system Inventory {
      event InventoryChanged (productId quantity)
    }

    screen CartScreen [Cart View]
    command AddItem (productId)
    command RemoveItem (itemId)
    readmodel CartItems
    processor OrderProcessor

    CartScreen --> AddItem
    AddItem --> ItemAdded
    ItemAdded --> CartItems
    CartItems --> CartScreen
    CartScreen --> RemoveItem
    RemoveItem --> ItemRemoved
```

## Syntax

The building blocks of an Event Modeling diagram are `systems`, `events`, `screens`, `processors`, `commands`, `read models`, and `edges`.

To begin an Event Modeling diagram, use the keyword `eventmodeling`, followed by your entity declarations and relationships.

### Systems

Systems are logical groupings that contain related events. The syntax for declaring a system is:

```
system {system id} [{title}]? {
  event {event id} ({data})?
  ...
}
```

For example:

```
system Cart [Shopping Cart] {
  event ItemAdded (productId)
  event CartCleared
}
```

creates a system identified as `Cart` with the title "Shopping Cart", containing two events: `ItemAdded` (with data parameter `productId`) and `CartCleared`.

The title is optional and can be used to provide a more descriptive label for the system.

### Events

Events represent things that have happened in the system. They must be declared within a system block.

The syntax for declaring an event is:

```
event {event id} ({data})?
```

For example:

```
event UserRegistered (email timestamp)
```

creates an event identified as `UserRegistered` with data parameters `email` and `timestamp`.

The data parameters are optional and can be used to document what information the event carries.

### Screens

Screens represent user interfaces or triggers that initiate commands.

The syntax for declaring a screen is:

```
screen {screen id} [{title}]?
```

For example:

```
screen LoginScreen [User Login]
```

creates a screen identified as `LoginScreen` with the title "User Login".

### Processors

Processors represent automated processes or background workers that react to events.

The syntax for declaring a processor is:

```
processor {processor id} [{title}]?
```

For example:

```
processor EmailProcessor [Email Notification Service]
```

creates a processor identified as `EmailProcessor` with the title "Email Notification Service".

### Commands

Commands represent actions that can be performed in the system.

The syntax for declaring a command is:

```
command {command id} ({data})? [{title}]?
```

For example:

```
command CreateOrder (userId items) [Create New Order]
```

creates a command identified as `CreateOrder` with data parameters `userId` and `items`, and the title "Create New Order".

### Read Models

Read Models represent projections or views of data that are used to display information.

The syntax for declaring a read model is:

```
readmodel {readmodel id} ({data})? [{title}]?
```

For example:

```
readmodel OrderSummary (orderId total) [Order Summary View]
```

creates a read model identified as `OrderSummary` with data parameters `orderId` and `total`, and the title "Order Summary View".

### Edges

Edges represent the flow of information between entities. The syntax for declaring an edge is:

```
{source id} --> {target id}
```

For example:

```
LoginScreen --> AuthenticateUser
AuthenticateUser --> UserAuthenticated
UserAuthenticated --> UserProfile
UserProfile --> DashboardScreen
```

creates a flow from the `LoginScreen` to the `AuthenticateUser` command, which produces the `UserAuthenticated` event, which updates the `UserProfile` read model, which is displayed on the `DashboardScreen`.

## Complete Example

Here's a complete example showing a user registration flow:

```mermaid-example
eventmodeling
    title User Registration Flow
    accTitle: User Registration Process
    accDescr: Shows the flow from registration screen through email verification

    system User {
      event UserRegistered (email)
      event EmailVerified (userId)
    }

    system Notification {
      event EmailSent (recipient)
    }

    screen RegistrationScreen
    command RegisterUser (email password)
    command VerifyEmail (token)
    readmodel UserProfile
    processor EmailProcessor

    RegistrationScreen --> RegisterUser
    RegisterUser --> UserRegistered
    UserRegistered --> EmailProcessor
    EmailProcessor --> EmailSent
    UserRegistered --> UserProfile
    UserProfile --> RegistrationScreen
```

## Typical Flow Pattern

Event Modeling diagrams typically follow this pattern:

1. **Screen/Trigger** → Initiates an action
2. **Command** → Represents the action to be performed
3. **Event** → Records what happened
4. **Read Model** → Projects the data for display
5. **Screen/Trigger** → Displays the updated information

This creates a cycle: `Screen → Command → Event → Read Model → Screen`

Processors can also react to events and trigger additional commands, creating more complex flows.

## Styling

Event Modeling diagrams use distinct colors for different entity types to make them easily distinguishable:

- **Screens**: White/light background
- **Processors**: Purple
- **Commands**: Blue
- **Read Models**: Green
- **Events**: Orange
- **Systems**: Gray swimlanes

These colors follow the standard Event Modeling conventions and are automatically applied based on the entity type.

## Configuration

Event Modeling diagrams can be configured using the `eventmodeling` section in the Mermaid configuration:

```javascript
{
  eventmodeling: {
    useMaxWidth: true,
    diagramMarginX: 50,
    diagramMarginY: 10
  }
}
```

See the [configuration documentation](/config/schema-docs/config-defs-event-modeling-diagram-config) for all available options.

## Accessibility

Event Modeling diagrams support accessibility features through title and description attributes:

```
eventmodeling
    title My System Flow
    accTitle: Accessible title for screen readers
    accDescr: Detailed description of the diagram for accessibility
```

These attributes help make the diagrams more accessible to users with screen readers and other assistive technologies.
