import prisma from "../utils/prisma";
import { validationResult } from "express-validator";

async function isExistBefore(req: any, res: any) {
  try {
    let category = await prisma.category.findUnique({
      where: {
        nameEn: req.body.nameEn,
      },
    });

    if (category) return true;

    category = await prisma.category.findUnique({
      where: {
        nameAr: req.body.nameAr,
      },
    });

    if (category) return true;

    return false;
  } catch {
    return res.status(400).json({ msg: "تأكد من صحة البيانات" });
  }
}

async function addCategory(req: any, res: any) {
  //get user from request user
  const user = req.user;

  if (user.role != "ADMIN")
    return res.status(400).json({ msg: "ليس لديك صلاحية لاضافة تصنيف" });

  /// validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // check if category name existed before
  if (await isExistBefore(req, res))
    return res.status(400).json({ msg: "التصنيف موجود من قبل" });

  //create the new category
  try {
    const newCategory = await prisma.category.create({
      data: {
        nameEn: req.body.nameEn,
        nameAr: req.body.nameAr,
      },
    });

    return res
      .status(200)
      .json({ msg: "تم اضافة التصنيف بنجاح", category: newCategory });
  } catch {
    return res.status(400).json({ msg: "تأكد من البيانات" });
  }
}

async function updateCategory(req: any, res: any) {
  //get user from request user
  const user = req.user;

  if (user.role != "ADMIN")
    return res.status(400).json({ msg: "ليس لديك صلاحية لاضافة تصنيف" });

  /// validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  //get the category object
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!category) return res.status(404).json({ msg: "التصنيف غير موجود" });

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        nameAr: req.body.nameAr ? req.body.nameAr : category.nameAr,
        nameEn: req.body.nameEn ? req.body.nameEn : category.nameEn,
      },
    });

    return res
      .status(200)
      .json({ msg: "تم التعديل بنجاح", category: updateCategory });
  } catch {
    return res.status(404).json({ msg: "يوجد تصنيف بهذا الاسم من قبل" });
  }
}

async function addSubCategory(req: any, res: any) {
  //get user from request user
  const user = req.user;

  if (user.role != "ADMIN")
    return res.status(400).json({ msg: "ليس لديك صلاحية لاضافة تصنيف" });

  /// validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  //get Major category
  const category = await prisma.category.findUnique({
    where: {
      id: req.body.categoryId,
    },
  });

  if (!category)
    return res.status(404).json({ msg: "التصنيف الرئيسى غير موجود" });

  //create the new category
  try {
    const newSubCategory = await prisma.subCategory.create({
      data: {
        nameEn: req.body.nameEn,
        nameAr: req.body.nameAr,
        categoryId: category.id,
      },
    });

    return res.status(200).json({
      msg: "تم اضافة التصنيف الفرعىى بنجاح",
      subCategory: newSubCategory,
    });
  } catch {
    return res.status(400).json({ msg: "تأكد من البيانات" });
  }
}

async function updateSubCategory(req: any, res: any) {
  //get user from request user
  const user = req.user;

  if (user.role != "ADMIN")
    return res.status(400).json({ msg: "ليس لديك صلاحية لاضافة تصنيف" });

  /// validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  //get the category object
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!subCategory)
      return res.status(404).json({ msg: "التصنيف الفرعى  غير موجود" });

    const updatedSubCategory = await prisma.subCategory.update({
      where: {
        id: subCategory.id,
      },
      data: {
        nameAr: req.body.nameAr ? req.body.nameAr : subCategory.nameAr,
        nameEn: req.body.nameEn ? req.body.nameEn : subCategory.nameEn,
        categoryId: req.body.categoryId
          ? req.body.categoryId
          : subCategory.categoryId,
      },
    });

    return res
      .status(200)
      .json({ msg: "تم التعديل بنجاح", category: updateCategory });
  } catch {
    return res.status(404).json({ msg: "يوجد تصنيف فرعى بهذا الاسم من قبل" });
  }
}
export { addCategory, updateCategory, addSubCategory, updateSubCategory };