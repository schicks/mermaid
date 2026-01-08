import { describe, expect, it } from 'vitest';

import { EventModeling } from '../src/language/index.js';
import { expectNoErrorsOrAlternatives, eventModelingParse as parse } from './test-util.js';

describe('eventmodeling', () => {
  describe('should handle basic eventmodeling definition', () => {
    it.each([
      `eventmodeling`,
      `  eventmodeling  `,
      `\teventmodeling\t`,
      `
        \teventmodeling
        `,
    ])('should handle basic eventmodeling keyword', (context: string) => {
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(EventModeling);
    });
  });

  describe('should handle TitleAndAccessibilities', () => {
    it('should handle eventmodeling + title', () => {
      const context = `eventmodeling
            title sample title`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(EventModeling);
      expect(result.value.title).toBe('sample title');
    });

    it('should handle eventmodeling + title + accTitle + accDescr', () => {
      const context = `eventmodeling
            title sample title
            accTitle: sample accTitle
            accDescr: sample accDescr
            `;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(EventModeling);
      expect(result.value.title).toBe('sample title');
      expect(result.value.accTitle).toBe('sample accTitle');
      expect(result.value.accDescr).toBe('sample accDescr');
    });
  });

  describe('should handle entity definitions', () => {
    it('should handle screen definition', () => {
      const context = `eventmodeling
            screen CartScreen`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.entities).toHaveLength(1);
      expect(result.value.entities[0].$type).toBe('Screen');
      expect(result.value.entities[0].id).toBe('CartScreen');
    });

    it('should handle command definition', () => {
      const context = `eventmodeling
            command AddItem`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.entities).toHaveLength(1);
      expect(result.value.entities[0].$type).toBe('Command');
      expect(result.value.entities[0].id).toBe('AddItem');
    });

    it('should handle command with data', () => {
      const context = `eventmodeling
            command AddItem (productId: number)`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.entities).toHaveLength(1);
      expect(result.value.entities[0].$type).toBe('Command');
      expect(result.value.entities[0].id).toBe('AddItem');
      expect(result.value.entities[0].data).toBe('productId: number');
    });

    it('should handle readmodel definition', () => {
      const context = `eventmodeling
            readmodel CartItems`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.entities).toHaveLength(1);
      expect(result.value.entities[0].$type).toBe('ReadModel');
      expect(result.value.entities[0].id).toBe('CartItems');
    });

    it('should handle processor definition', () => {
      const context = `eventmodeling
            processor OrderProcessor`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.entities).toHaveLength(1);
      expect(result.value.entities[0].$type).toBe('Processor');
      expect(result.value.entities[0].id).toBe('OrderProcessor');
    });
  });

  describe('should handle system definitions', () => {
    it('should handle system with events', () => {
      const context = `eventmodeling
            system Cart {
              event ItemAdded
              event CartCleared
            }`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.systems).toHaveLength(1);
      expect(result.value.systems[0].id).toBe('Cart');
      expect(result.value.systems[0].events).toHaveLength(2);
      expect(result.value.systems[0].events[0].id).toBe('ItemAdded');
      expect(result.value.systems[0].events[1].id).toBe('CartCleared');
    });

    it('should handle event with data', () => {
      const context = `eventmodeling
            system Cart {
              event ItemAdded (productId: string, quantity: number)
            }`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.systems[0].events[0].data).toBe('productId: string, quantity: number');
    });
  });

  describe('should handle edges', () => {
    it('should handle simple edge', () => {
      const context = `eventmodeling
            screen CartScreen
            command AddItem
            CartScreen --> AddItem`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.edges).toHaveLength(1);
      expect(result.value.edges[0].source).toBe('CartScreen');
      expect(result.value.edges[0].target).toBe('AddItem');
      expect(result.value.edges[0].arrow).toBe('-->');
    });
  });

  describe('should handle complete example', () => {
    it('should handle full event modeling diagram', () => {
      const context = `eventmodeling
            title Shopping Cart Flow

            system Cart {
              event ItemAdded
              event CartCleared
            }

            system Inventory {
              event InventoryChanged
            }

            screen CartScreen
            command AddItem (productId: number)
            readmodel CartItems

            CartScreen --> AddItem
            AddItem --> ItemAdded
            ItemAdded --> CartItems
            CartItems --> CartScreen`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.title).toBe('Shopping Cart Flow');
      expect(result.value.systems).toHaveLength(2);
      expect(result.value.entities).toHaveLength(3);
      expect(result.value.edges).toHaveLength(4);
    });
  });
});
