const validateProductCamps = (req, res, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };
    for (const propertie of Object.keys(newProduct)) {
      if (!newProduct[propertie]) {
        throw new Error(`The property: ${propertie} is required`);
      }
    }
    next()
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { validateProductCamps };
