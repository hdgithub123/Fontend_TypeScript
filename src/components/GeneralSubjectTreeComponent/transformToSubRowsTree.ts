const transformToSubRowsTree = ({
  data,
  childField,
  parentField,
}: {
  data: Array<Record<string, any>>;
  childField: string;
  parentField: string;
}): Array<Record<string, any>> => {
  const map = new Map<string, any>();
  const roots: any[] = [];

  data.forEach(item => {
    map.set(item[childField], { ...item, subRows: [] });
  });

  data.forEach(item => {
    const parentId = item[parentField];
    const node = map.get(item[childField]);

    if (parentId && map.has(parentId)) {
      map.get(parentId).subRows.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default transformToSubRowsTree;

