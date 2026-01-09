import { it, describe, expect, beforeEach } from 'vitest';
import { EventModelingDB } from './db.js';
import { parser } from './parser.js';

describe('eventmodeling diagrams', () => {
  let db: EventModelingDB;
  beforeEach(() => {
    db = new EventModelingDB();
    if (parser.parser) {
      parser.parser.yy = db;
    }
  });

  it('should handle a basic eventmodeling definition', async () => {
    const str = `eventmodeling`;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(db.getEntities()).toHaveLength(0);
    expect(db.getSystems()).toHaveLength(0);
    expect(db.getEdges()).toHaveLength(0);
  });

  it('should handle diagram with title and accessibility', async () => {
    const str = `eventmodeling
    title Shopping Cart Flow
    accTitle: Shopping Cart accTitle
    accDescr: Shopping Cart accDescription
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(db.getDiagramTitle()).toBe('Shopping Cart Flow');
    expect(db.getAccTitle()).toBe('Shopping Cart accTitle');
    expect(db.getAccDescription()).toBe('Shopping Cart accDescription');
  });

  describe('entity storage', () => {
    it('should store screen entities', async () => {
      const str = `eventmodeling
      screen CartScreen
      screen CheckoutScreen [Checkout]
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const entities = db.getEntities();
      expect(entities).toHaveLength(2);
      expect(entities[0]).toMatchObject({
        id: 'CartScreen',
        type: 'screen',
      });
      expect(entities[1]).toMatchObject({
        id: 'CheckoutScreen',
        type: 'screen',
        title: 'Checkout',
      });
    });

    it('should store command entities', async () => {
      const str = `eventmodeling
      command AddItem
      command RemoveItem (itemId)
      command UpdateQuantity (itemId quantity) [Update Qty]
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const entities = db.getEntities();
      expect(entities).toHaveLength(3);
      expect(entities[0]).toMatchObject({
        id: 'AddItem',
        type: 'command',
      });
      expect(entities[1]).toMatchObject({
        id: 'RemoveItem',
        type: 'command',
        data: 'itemId',
      });
      expect(entities[2]).toMatchObject({
        id: 'UpdateQuantity',
        type: 'command',
        data: 'itemId quantity',
        title: 'Update Qty',
      });
    });

    it('should store readmodel entities', async () => {
      const str = `eventmodeling
      readmodel CartItems
      readmodel OrderHistory (userId)
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const entities = db.getEntities();
      expect(entities).toHaveLength(2);
      expect(entities[0]).toMatchObject({
        id: 'CartItems',
        type: 'readmodel',
      });
      expect(entities[1]).toMatchObject({
        id: 'OrderHistory',
        type: 'readmodel',
        data: 'userId',
      });
    });

    it('should store processor entities', async () => {
      const str = `eventmodeling
      processor OrderProcessor
      processor InventoryProcessor [Inventory Proc]
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const entities = db.getEntities();
      expect(entities).toHaveLength(2);
      expect(entities[0]).toMatchObject({
        id: 'OrderProcessor',
        type: 'processor',
      });
      expect(entities[1]).toMatchObject({
        id: 'InventoryProcessor',
        type: 'processor',
        title: 'Inventory Proc',
      });
    });
  });

  describe('system and event storage', () => {
    it('should store systems with events', async () => {
      const str = `eventmodeling
      system Cart {
        event ItemAdded
        event ItemRemoved
      }
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const systems = db.getSystems();
      expect(systems).toHaveLength(1);
      expect(systems[0]).toMatchObject({
        id: 'Cart',
        events: [
          { id: 'ItemAdded', type: 'event', systemId: 'Cart' },
          { id: 'ItemRemoved', type: 'event', systemId: 'Cart' },
        ],
      });
    });

    it('should store events with data', async () => {
      const str = `eventmodeling
      system Cart {
        event ItemAdded (productId quantity)
        event CartCleared
      }
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const systems = db.getSystems();
      expect(systems[0].events[0]).toMatchObject({
        id: 'ItemAdded',
        type: 'event',
        systemId: 'Cart',
        data: 'productId quantity',
      });
    });

    it('should add events as entities', async () => {
      const str = `eventmodeling
      system Cart {
        event ItemAdded
      }
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const entities = db.getEntities();
      expect(entities).toHaveLength(1);
      expect(entities[0]).toMatchObject({
        id: 'ItemAdded',
        type: 'event',
        systemId: 'Cart',
      });
    });

    it('should retrieve all events from all systems', async () => {
      const str = `eventmodeling
      system Cart {
        event ItemAdded
        event CartCleared
      }
      system Inventory {
        event InventoryChanged
      }
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const events = db.getEvents();
      expect(events).toHaveLength(3);
      expect(events.map((e) => e.id)).toEqual(['ItemAdded', 'CartCleared', 'InventoryChanged']);
    });
  });

  describe('edge storage', () => {
    it('should store edges', async () => {
      const str = `eventmodeling
      screen CartScreen
      command AddItem
      CartScreen --> AddItem
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const edges = db.getEdges();
      expect(edges).toHaveLength(1);
      expect(edges[0]).toMatchObject({
        source: 'CartScreen',
        target: 'AddItem',
        arrow: '-->',
      });
    });

    it('should store multiple edges', async () => {
      const str = `eventmodeling
      screen CartScreen
      command AddItem
      readmodel CartItems
      CartScreen --> AddItem
      AddItem --> CartItems
      CartItems --> CartScreen
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const edges = db.getEdges();
      expect(edges).toHaveLength(3);
    });

    it('should handle different arrow types', async () => {
      const str = `eventmodeling
      screen A
      screen B
      screen C
      A --> B
      B <-- C
      A <-> C
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const edges = db.getEdges();
      expect(edges).toHaveLength(3);
      expect(edges[0].arrow).toBe('-->');
      expect(edges[1].arrow).toBe('<--');
      expect(edges[2].arrow).toBe('<->');
    });
  });

  describe('accessor methods', () => {
    it('should retrieve entity by id', async () => {
      const str = `eventmodeling
      screen CartScreen
      command AddItem
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const screen = db.getEntity('CartScreen');
      expect(screen).toMatchObject({
        id: 'CartScreen',
        type: 'screen',
      });
      const command = db.getEntity('AddItem');
      expect(command).toMatchObject({
        id: 'AddItem',
        type: 'command',
      });
      const notFound = db.getEntity('NonExistent');
      expect(notFound).toBeUndefined();
    });

    it('should retrieve system by id', async () => {
      const str = `eventmodeling
      system Cart {
        event ItemAdded
      }
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      const system = db.getSystem('Cart');
      expect(system).toMatchObject({
        id: 'Cart',
        events: [{ id: 'ItemAdded', type: 'event', systemId: 'Cart' }],
      });
      const notFound = db.getSystem('NonExistent');
      expect(notFound).toBeUndefined();
    });
  });

  describe('clear method', () => {
    it('should clear all state', async () => {
      const str = `eventmodeling
      title Test
      system Cart {
        event ItemAdded
      }
      screen CartScreen
      command AddItem
      CartScreen --> AddItem
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      expect(db.getEntities().length).toBeGreaterThan(0);
      expect(db.getSystems().length).toBeGreaterThan(0);
      expect(db.getEdges().length).toBeGreaterThan(0);
      expect(db.getDiagramTitle()).toBe('Test');

      db.clear();

      expect(db.getEntities()).toHaveLength(0);
      expect(db.getSystems()).toHaveLength(0);
      expect(db.getEdges()).toHaveLength(0);
      expect(db.getDiagramTitle()).toBe('');
    });
  });

  describe('complete example', () => {
    it('should handle full event modeling diagram', async () => {
      const str = `eventmodeling
      title Shopping Cart Flow

      system Cart {
        event ItemAdded (productId)
        event CartCleared
      }

      system Inventory {
        event InventoryChanged
      }

      screen CartScreen
      command AddItem (productId)
      readmodel CartItems
      processor OrderProcessor

      CartScreen --> AddItem
      AddItem --> ItemAdded
      ItemAdded --> CartItems
      CartItems --> CartScreen
      `;
      await expect(parser.parse(str)).resolves.not.toThrow();

      expect(db.getDiagramTitle()).toBe('Shopping Cart Flow');
      expect(db.getSystems()).toHaveLength(2);
      expect(db.getEntities()).toHaveLength(7); // 3 events + 4 entities
      expect(db.getEdges()).toHaveLength(4);

      const cartSystem = db.getSystem('Cart');
      expect(cartSystem?.events).toHaveLength(2);

      const events = db.getEvents();
      expect(events).toHaveLength(3);
    });
  });
});
