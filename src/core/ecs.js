// Harvested from World Lab's proven minimal ECS substrate.
// Accessibility owns this realization; no World Lab entity vocabulary crosses this boundary.
export function createWorld() {
  let next = 1;
  const alive = new Set();
  const stores = new Map();

  const component = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name);
  };

  const entity = () => {
    const id = next++;
    alive.add(id);
    return id;
  };

  const add = (id, store, value = true) => {
    if (!alive.has(id)) throw new Error(`dead entity ${id}`);
    store.set(id, value);
    return value;
  };

  const remove = (id, store) => store.delete(id);
  const has = (id, store) => alive.has(id) && store.has(id);

  const query = (...components) => {
    if (!components.length) return [...alive];
    const smallest = components.reduce((a, b) => a.size <= b.size ? a : b);
    return [...smallest.keys()].filter(
      id => alive.has(id) && components.every(component => component.has(id))
    );
  };

  const destroy = id => {
    alive.delete(id);
    for (const store of stores.values()) store.delete(id);
  };

  return { component, entity, add, remove, has, query, destroy, alive, stores };
}
