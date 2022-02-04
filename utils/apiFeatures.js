
class ApiFeatures{

constructor(query,queryString){

  this.query = query;
  this.queryString = queryString
}

//~ 1.Filtering
filter(){

    //* Creating a query object

    const queryObj = {...this.queryString}

    const excludedItems = ['page','limit','sort','fields']

    //* Removing the excluded items

    excludedItems.forEach(i=>delete queryObj[i])


    let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)


        this.query = this.query.find(JSON.parse(queryStr))

  return this;
}


//~ 2.Sorting
sort(){

  if(this.queryString.sort){
    const sortBy = this.queryString.sort.split(',').join(" ")

    this.query = this.query.sort(sortBy)

  }else{

    this.query = this.query.sort('-createdAt')
  }

  return this;

}

//~ 3. Limiting fields

limitField(){

  if(this.queryString.fields){

    const fields = this.queryString.fields.split(',').join(' ')


    this.query = this.query.select(fields)

  }
  else {
  this.query = this.query.select('-__v')

  }

  return this;


}


//~ 4. Pagination
pagination(){

  const page = +this.queryString.page||1;
  const limit = +this.queryString.limit||100;
  const skipped = (page-1)*limit

  this.query = this.query.skip(skipped).limit(limit)

    return this;
}



}


module.exports = ApiFeatures
