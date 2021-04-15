const prescriptionReducer = (products, action) => {
  let newProductsArray
  switch (action.type) {
    case 'INIT':
      return []
    case 'ADD_PRODUCT':
      return [...products, action.payload]
    case 'SET_PRODUCTS':
      return [...action.payload]
    case 'REMOVE_PRODUCT':
      newProductsArray = products.filter(({ key }) => action.payload.key !== key)
      return newProductsArray.map((product, index) => {
        product.key = index + 1
        return product
      })
    case 'EDIT_PRODUCT':
      return products.map(product => {
        if (product.key === action.payload.key) {
          product = action.payload
        }
        return product
      })
    default:
      return products
  }
}

export default prescriptionReducer
