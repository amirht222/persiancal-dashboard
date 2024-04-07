export const mapUserStatus = (status: number) => {
  switch (status) {
    case 1:
      return "در انتظار";
    case 2:
      return "فعال";
    case 3:
      return "مسدود";
    case 4:
      return "حذف شده";
  }
};
export const mapUserRole = (role: number) => {
  switch (role) {
    case 1:
      return "کاربر عادی";
    case 2:
      return "ادمین";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEnglishToPersianDigits = (value: any) => {
  if (!value && value != "0") return value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return value.toString().replace(/\d/g, (d: any) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatNumbersWithCommas = (value: any) => {
  if (!value) return value;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const convertPersianToEnglishDigits = (
  num: string | number
): string | number => {
  if (num === null || num === undefined) {
    return 0;
  }
  if (typeof num !== "string" || num.length === 0) return num.toString();
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arDigits = "٠١٢٣٤٥٦٧٨٩";
  let output = "";
  for (let ipos = 0; ipos < num.length; ipos++) {
    const faIndex = faDigits.indexOf(num[ipos]);
    if (faIndex >= 0) {
      output += faIndex.toString();
      continue;
    }
    const arIndex = arDigits.indexOf(num[ipos]);
    if (arIndex >= 0) {
      output += arIndex.toString();
      continue;
    }
    output += num[ipos];
  }
  return output.replace(/,/g, "");
};

export const objectCleaner = (obj: object) => {
  for (const propName in obj) {
    if (
      obj[propName as keyof object] === null ||
      obj[propName as keyof object] === undefined ||
      obj[propName as keyof object] === ""
    ) {
      delete obj[propName as keyof object];
    }
  }
  return obj;
};

export const toBase64 = (file: File) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataURL = reader.result;
      const base64 = dataURL
        ?.toString()
        .replace("data:", "")
        .replace(/^.+,/, "");
      resolve(base64 || null);
    };
    reader.onerror = (error) => reject(error);
  });
};
