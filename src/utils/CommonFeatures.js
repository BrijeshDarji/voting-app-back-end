export default class CommonFeatures {
    constructor(query, queryObj) {
        this.query = query
        this.queryObj = queryObj
    }

    paginate() {
        const page = (this.queryObj.page * 1) + 1
        const limit = this.queryObj.limit * 1 || 20
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)
        return this
    }

    sort() {
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(",").join(" ")
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort("-created")
        }
        return this
    }
}
