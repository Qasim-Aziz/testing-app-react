const prescriptionReducer = (products, action) => {
  let newProductsArray
  switch (action.type) {
    case 'INIT':
      return []
    case 'ADD_PRODUCT':
      console.log('THE ADD PRODUCTS', action)
      return [...products, action.payload]
    case 'SET_PRODUCTS':
      console.log('THE SET PRODUCTS', action)
      return [...action.payload]
    case 'REMOVE_PRODUCT':
      console.log('THE REMOVE PRODUCTS', action)
      newProductsArray = products.filter(({ key }) => action.payload.key !== key)
      return newProductsArray.map((product, index) => {
        product.key = index + 1
        return product
      })
    case 'EDIT_PRODUCT':
      console.log('THE EDIT PRODUCTS', action)
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
