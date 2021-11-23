const errors = require("./errors");

const users = [
    {
        username: "Primus",
        reputation: 14,
        rank: "newbie"
    },
    {
        username: "Secondus",
        reputation: 1400,
        rank: "vet"
    }
];

const products = [
    {
        id: "4011",
        name: "Bananas",
        unit: 1,
        unit_type: "lbs",
        quantity: 1
    },
    {
        id: "94011",
        name: "Organic Bananas",
        unit: 1,
        unit_type: "lbs",
        quantity: 1
    },
    {
        id: "4225",
        name: "Hass Avocados",
        unit: 1,
        unit_type: "ea",
        quantity: 1
    },
    {
        id: "94225",
        name: "Hass Avocados",
        unit: 1,
        unit_type: "ea",
        quantity: 1
    },
    {
        id: "027000380406",
        name: "Hunt's 100% Natural Diced Tomatoes",
        unit: 14.5,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "027000379882",
        name: "Hunt's 100% Natural Diced Tomatoes, 8ct",
        unit: 14.5,
        unit_type: "oz",
        quantity: 8
    },
    {
        id: "0001111081533",
        name: "Kroger Diced Tomatoes in Tomato Juice",
        unit: 14.5,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "049000000450",
        name: "Diet Coke - 20 fl oz Bottle",
        unit: 20,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "049000050110",
        name: "Diet Coke - 2 L Bottle",
        unit: 2,
        unit_type: "L",
        quantity: 1
    },
];

const product_tags = products.map(product => 
    product.name.split(" ").map(tag => 
        ({ product_id: product.id, tag: tag }))
).flat();

const tags = product_tags.map(product_tag => product_tag.tag)
    .filter((value, index, self) => self.indexOf(value) === index)

let list_id = 1;

class ShoppingList {
    constructor(username, specific, generic) {
        this.id = list_id++;
        this.owner = username;
        this.specific = specific;
        this.generic = generic;
    }
}

const shopping_lists = [
    new ShoppingList(
        users[0].username,
        [
            { list_id: 1, product_id: "027000380406"}
        ],
        [
            { list_id: 1, description: "Bananas" }
        ]
    ),
    new ShoppingList(
        users[1].username,
        [
            { list_id: 1, product_id: "4011"}
        ],
        [
            { list_id: 1, description: "Diced Tomatoes" }
        ]
    ),
];

const stores = [
    {
        name: "Kroger",
        id: 1,
        street1: "123 Street St",
        street2: "#45",
        zip: 97005,
        city: "Beaverton",
        state: "OR"
    },
    {
        name: "Albersons",
        id: 2,
        street1: "678 Avenue Ave",
        zip: 97005,
        city: "Beaverton",
        state: "OR"
    },
    {
        name: "Wal*Mart",
        id: 3,
        street1: "910 Broadway Way",
        zip: 97006,
        city: "Beaverton",
        state: "OR"
    }
];

let reviewID = 1;

class Review {
    constructor(reviewer, store, rating, text) {
        this.id = reviewID++;
        this.reviewer = reviewer.username;
        this.store_id = store.id;
        this.rating = rating;
        this.text = text;
    }
}

const reviews = [
    new Review(users[0], stores[0], 1, "It's bad"),
    new Review(users[1], stores[0], 2, "It's not good"),
    new Review(users[0], stores[1], 3, "It's okay"),
    new Review(users[1], stores[1], 4, "It’s good")
];

let priceID = 1;

class Price {
    constructor(user, store_id, product_id, price, sale, sale_ends) {
        this.username = user.username;
        this.store_id = store_id;
        this.product_id = product_id;
        this.price = price;
        this.sale = sale || false;
        this.sale_ends = sale_ends;
        this.id = priceID++;
    }
}

const prices = [
    new Price(users[0], 1, "4011", 0.47),
    new Price(users[0], 1, "4011", 0.37, true, 1),
    new Price(users[1], 2, "4011", 0.67),
    new Price(users[1], 2, "4011", 0.45, true, Number.MAX_SAFE_INTEGER),
    new Price(users[0], 1, "4225", 1.33),
    new Price(users[1], 2, "4225", 1.00),
    new Price(users[0], 1, "027000380406", 1.2),
    new Price(users[1], 2, "027000380406", 0.89),
    new Price(users[0], 1, "001111081533", 0.99),
    new Price(users[0], 1, "049000000450", 1.25),
    new Price(users[1], 2, "049000000450", 1.20),
    new Price(users[0], 3, "049000000450", 1.00),
    new Price(users[0], 1, "049000050110", 1.89),
    new Price(users[1], 2, "049000050110", 1.99),
    new Price(users[0], 3, "049000050110", 1.50),
]

class Comparison {
    constructor (list, zip) {
        this.list = list;
        this.zip = zip;
        this.results = stores
            .filter(store => store.zip == zip)
            .map(store => this.buildCart(store, list));
    }

    buildCart(store, list) {
        
        return {
            store: store,
            line_items: list.specific.map(line_item => {
                let each = getPrices(store.id, line_item.product_id);
                return {
                    product: getProduct(line_item.product_id),
                    count: line_item.count,
                    each: each,
                    subtoal: each * line_item.count
                }
            }),
            missing: list.generic,
            total: 0
        }
    }

    getBestPrice(store_id, product_id) {
        return getPrices(store_id, product_id).reduce((lowest, current) =>{
            if(current) {
                if(lowest) return lowest.price < current.price ? lowest : current;
                return current;
            }
            return lowest;
        });
    }
}

comparisons = [
    new Comparison(shopping_lists[0], 12345),
    new Comparison(shopping_lists[0], 97005),
    new Comparison(shopping_lists[0], 97006),
]

function getProduct (product_id) {
    return products.find(product => product.id == product_id)
}

function getPrices (store_id, product_id) {
    return prices.filter(price =>
        price.store_id == store_id &&
        price.product_id == product_id
    )
}

function mockService (nock, serviceName, array, route, key, notFoundError) {
    let serviceUrl = `https://${serviceName}.com`;

    array.forEach(item => nock(serviceUrl)
        .persist()
        .get(`/${route}/${item[key]}`)
        .reply(200, item)
    );

    array.forEach(item => nock(serviceUrl)
        .delete(`/${route}/${item[key]}`)
        .reply(204)
    );

    if(notFoundError) {
        nock(serviceUrl)
            .persist()
            .get(`/${route}/invalid`)
            .reply(404, { Error: notFoundError.message })
     
        nock(serviceUrl)
            .persist()
            .delete(`/${route}/invalid`)
            .reply(404, { Error: notFoundError.message })
    }

    return {
        name: serviceName,
        url: serviceUrl,
        token: "placeholder" 

    }
}

class ServiceMockager {
    constructor(nock, serviceNames) {
        this.nock = nock;
        this.registered = serviceNames;
    
        if(serviceNames.includes('comparison')) this.registerComparison();
        if(serviceNames.includes('live feed')) this.registerLiveFeed();
        if(serviceNames.includes('price')) this.registerPrices();
        if(serviceNames.includes('product')) this.registerProducts();
        if(serviceNames.includes('review')) this.registerReviews();
        if(serviceNames.includes('list')) this.registerShoppingLists();
        if(serviceNames.includes('store')) this.registerStores();
        if(serviceNames.includes('tag')) this.registerTags();
        if(serviceNames.includes('user')) this.registerUsers();
    }

    registerComparison() {
        let serviceUrl = "https://compariandsons.com"

        comparisons.forEach(comparison => this.nock(serviceUrl)
            .get(`/${comparison.list.id}`, { username: comparison.list.owner, zip: comparison.zip })
            .reply(200, comparison.results)
        );
        
        this.comparison = {
            name: "comparison",
            url: serviceUrl,
            token: "placeholder"            
        }
    }

    registerPrices() {
        let serviceUrl = "https://price.com"
        let error = { Error: new errors.PriceNotFoundError().message }

        this.nock(serviceUrl)
            .persist()
            .post('/prices')
            .reply(204)
        
        stores.forEach(store =>
            products.forEach(product => this.nock(serviceUrl)
                .persist()
                .get('/prices', { store_id: store.id, product_id: product.id })
                .reply(200, prices.filter(price =>
                    price.store_id == store.id &&
                    price.product_id == product.id && 
                    (!price.sale || price.sale_ends > Date.now())
                ))
            )
        );

        prices.forEach(price => {
            this.nock(serviceUrl)
                .get(`/prices/${price.id}`)
                .reply(200, price)

            this.nock(serviceUrl)
                .delete(`/prices/${price.id}`)
                .reply(204)
        });

        this.nock(serviceUrl)
            .get('/prices/invalid')
            .reply(404, error)

        this.nock(serviceUrl)
            .delete('/prices/invalid')
            .reply(404, error)

        this.price = {
            name: "price",
            url: serviceUrl,
            token: "placeholder"            
        };
    }

    registerLiveFeed() {
        let serviceUrl = "https://feed.com"
        
        this['live feed'] = {
            name: "feed",
            url: serviceUrl,
            token: "placeholder"            
        }
    }

    registerProducts() {
        this.product = mockService(this.nock, 'product', products, 'products',
            "id",new errors.ProductNotFoundError())
    }

    registerReviews() {
        let serviceUrl = 'https://review.com';

        users.forEach(user => this.nock(serviceUrl)
            .persist()
            .get(`/reviews`, { username: user.username })
            .reply(200, reviews.filter(review => review.reviewer == user.username))
        );

        stores.forEach(store => this.nock(serviceUrl)
            .persist()
            .get(`/reviews`, { store_id: store.id })
            .reply(200, reviews.filter(review => review.store_id == store.id))
        );

        console.log("Wha")
        reviews.forEach(review => {
            this.nock(serviceUrl)
                .persist()
                .post(`/reviews`, {
                    reviewer: review.reviewer,
                    store_id: review.store_id.toString(),
                    rating: review.rating.toString(),
                    text: review.text
                })
                .reply(201, review)

            this.nock(serviceUrl)
                .persist()
                .get(`/reviews/${review.id}`)
                .reply(200, review)
        });

        this.review = mockService(this.nock, 'review', reviews, 'reviews', "id",
            new errors.ReviewNotFoundError())
    }

    registerShoppingLists() {
        this['list'] = mockService(this.nock, 'list', shopping_lists, 'lists', "id",
            new errors.ListNotFoundError())
        

        let serviceUrl = `https://list.com`;

        shopping_lists.forEach(list => {
            this.nock(serviceUrl)
                .persist()
                .get(`/lists/${list.id}`, { username: list.owner })
                .reply(200, list)

            this.nock(serviceUrl)
                .persist()
                .post(`/lists/${list.id}/specific`, { username: list.owner, product_id: /.+/i, count: /.+/i })
                .reply(204)

            this.nock(serviceUrl)
                .persist()
                .post(`/lists/${list.id}/generic`, { username: list.owner, product_id: /.+/i, count: /.+/i })
                .reply(204)

            products.forEach(product => {
                this.nock(serviceUrl)
                    .persist()
                    .put(`/lists/${list.id}/specific/${product.id}`, { username: list.owner, count: /.+/i })
                    .reply(204)
    
                this.nock(serviceUrl)
                    .persist()
                    .put(`/lists/${list.id}/generic/${product.name}`, { username: list.owner, count: /.+/i })
                    .reply(204)
            })
                
            this.nock(serviceUrl)
                .persist()
                .delete(`/lists/${list.id}`, { username: list.owner })
                .reply(204)
        });

        users.forEach(user => {
            this.nock(serviceUrl)
                .persist()
                .post('/lists', { username: user.username })
                .reply(201, new ShoppingList(user.username, [], []))

            this.nock(serviceUrl)
                .persist()
                .get(`/lists`, { username: user.username })
                .reply(200, shopping_lists.filter(list => list.owner == user.username))
        });
    
        this.nock(serviceUrl)
            .persist()
            .get(`/lists/invalid`)
            .reply(404, { Error: new errors.ListNotFoundError().message })

        this['list'] = {
            name: 'list',
            url: serviceUrl,
            token: "placeholder"
        }
    }

    registerStores() {
        this.store = mockService(this.nock, 'store', stores, 'stores', "id",
            new errors.StoreNotFoundError())
    }

    registerTags() {
        let serviceUrl = "https://product.com"
        this.tag = {
            name: "tag",
            url: serviceUrl,
            token: "placeholder"            
        }
    }

    registerUsers() {
        this.user = mockService(this.nock, 'user', users, 'users', "username",
            new errors.UserNotFoundError())
    }

    getServices() {
        return this.registered.map(serviceName => this[serviceName]);
    }
}

module.exports = {
    prices, products, product_tags,
    reviews, shopping_lists, stores,
    tags, users,
    getProduct, getPrices,
    ServiceMockager
}