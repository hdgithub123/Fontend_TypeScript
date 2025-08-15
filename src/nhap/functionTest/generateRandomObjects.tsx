function generateRandomObjects<T extends Record<string, any>>(
  template: T,
  count: number,
  appearanceProbability: number = 1
): T[] {
  // Hàm kiểm tra trường có nên xuất hiện
  const shouldAppear = () => Math.random() < appearanceProbability;

  // Hàm tạo UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Hàm tạo email
  const generateEmail = () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const name = Math.random().toString(36).substring(2, 10);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
  };

  // Hàm tạo số điện thoại
  const generatePhone = () => {
    const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `${prefix}${suffix}`;
  };

  // Hàm tạo ngày ngẫu nhiên (10 năm trở lại đây)
  const generateRandomDate = () => {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    return new Date(
      tenYearsAgo.getTime() + Math.random() * (Date.now() - tenYearsAgo.getTime())
    );
  };


  // Hàm nhận diện kiểu dữ liệu đặc biệt
  const detectSpecialType = (value: any): string | null => {
    if (typeof value !== 'string') return null;

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
      return 'uuid';
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'email';
    }

    if (/^(0|\+84)(\d{9,10})$/.test(value)) {
      return 'phone';
    }

    if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2})?$/.test(value)) {
      return 'datetime';
    }
    if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2})?(Z|[+-]\d{2}:\d{2})?$/.test(value)) {
      return 'datetime';
    }

    return null;
  };

  // Hàm tạo giá trị
  const generateValue = (value: any): any => {
    if (!shouldAppear()) return undefined;

    // Xử lý Date object
    if (value instanceof Date) {
      return generateRandomDate();
    }

    // Xử lý các kiểu đặc biệt
    const specialType = detectSpecialType(value);
    if (specialType) {
      switch (specialType) {
        case 'uuid': return generateUUID();
        case 'email': return generateEmail();
        case 'phone': return generatePhone();
        case 'datetime':
          const date = generateRandomDate();
          return formatDateTime(date, value);
      }
    }

    // Xử lý các kiểu cơ bản
    switch (typeof value) {
      case 'string':
        return Math.random().toString(36).substring(2, 10);
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'object':
        if (value === null) return null;
        if (Array.isArray(value)) {
          return value.length > 0
            ? Array(Math.floor(Math.random() * 3) + 1)
              .fill(null)
              .map(() => generateValue(value[0]))
            : [];
        }
        const obj: Record<string, any> = {};
        for (const key in value) {
          obj[key] = generateValue(value[key]);
        }
        return obj;
      default:
        return null;
    }
  };

  // Tạo mảng kết quả
  return Array.from({ length: count }, () => {
    const newObj: Record<string, any> = {};
    for (const key in template) {
      newObj[key] = generateValue(template[key]);
    }
    return newObj as T;
  });
}

export default generateRandomObjects;

const formatDateTime = (date: Date, templateValue: string): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Kiểm tra định dạng template
  if (templateValue.includes('T') && templateValue.endsWith('Z')) {
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  } else if (templateValue.includes('T') && templateValue.includes('+')) {
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
  } else if (templateValue.includes('T')) {
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(templateValue)) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(templateValue)) {
    return `${year}-${month}-${day}`;
  }

  // Mặc định trả về ISO string với timezone
  return date.toISOString();
};