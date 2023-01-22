const sample = [
    {
        id: 1,
        name: "family restaurant",
        time: "10:00AM-9:00PM",
        date: "19/09/2023",
        price: 200,
        profile_pic: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        address: "kozhikode,hilitemall,palazhi road",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image1: "http://localhost:3000/images/banner.jpg",
        image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
        image3: "https://www.washingtonpost.com/resizer/cnhpemoRV1Z5OwUvbhOw5Aktwiw=/arc-anglerfish-washpost-prod-washpost/public/ER3EAZKWPNWSAOG6YWQIRG55C4.jpg",
        location: {
            x: 48.8583736,
            y: 2.2922926
        },
        items: [{
            id: "food_1",
            name: "biriyani",
            quantity: 4
        },
        {
            id: "food_2",
            name: "chicken curry",
            quantity: 9
        },
        {
            id: "food_3",
            name: "kuzhi mandhi",
            quantity: 10
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        },],
        services: [
            {
                title: "Free wifi",
                description: "unlimited free 24x7 hours wifi"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "Conference hall",
                description: "24x7 conference hall"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "conference hall",
                description: "24x7 conference hall"
            },
        ],
        reviews: [{
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }, {
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }, {
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }, {
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }, {
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }, {
            review: "good hotel near bustand",
            star: 5,
            likes: [1, 2, 3],
            dislike: []
        }],
    }
    , {
        id: 2,
        name: "family restaurant",
        time: "10:00AM-9:00PM",
        date: "19/09/2023",
        price: 200,
        price: 1000,
        total: 1000, profile_pic: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
        address: "kozhikode,hilitemall,palazhi road",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        table: 5,
        chair: 20,
        image1: "http://localhost:3000/images/banner.jpg",
        image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
        image3: "https://www.washingtonpost.com/resizer/cnhpemoRV1Z5OwUvbhOw5Aktwiw=/arc-anglerfish-washpost-prod-washpost/public/ER3EAZKWPNWSAOG6YWQIRG55C4.jpg",
        items: [{
            id: "food_1",
            name: "biriyani",
            quantity: 4
        },
        {
            id: "food_2",
            name: "chicken curry",
            quantity: 9
        },
        {
            id: "food_3",
            name: "kuzhi mandhi",
            quantity: 10
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            name: "biriyani",
            quantity: 4
        },],
        services: [
            {
                title: "Free wifi",
                description: "unlimited free 24x7 hours wifi"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "conference hall",
                description: "24x7 conference hall"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "conference hall",
                description: "24x7 conference hall"
            },
        ]
    }, {
        id: 3,
        name: "family restaurant",
        time: "10:00AM-9:00PM",
        date: "19/09/2023",
        price: 200,
        address: "kozhikode,hilitemall,palazhi road",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image1: "http://localhost:3000/images/banner.jpg",
        image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
        image3: "https://www.washingtonpost.com/resizer/cnhpemoRV1Z5OwUvbhOw5Aktwiw=/arc-anglerfish-washpost-prod-washpost/public/ER3EAZKWPNWSAOG6YWQIRG55C4.jpg",
        items: [{
            id: "food_1",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "biriyani",
            quantity: 4
        },
        {
            id: "food_2",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "chicken curry",
            quantity: 9
        },
        {
            id: "food_3",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "kuzhi mandhi",
            quantity: 10
        }, {
            id: "food_1",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "biriyani",
            quantity: 4
        }, {
            id: "food_1",
            image2: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80",
            name: "biriyani",
            quantity: 4
        },],
        services: [
            {
                title: "Free wifi",
                description: "unlimited free 24x7 hours wifi"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "conference hall",
                description: "24x7 conference hall"
            },
            {
                title: "Free parking",
                description: "unlimited free 24x7 hours free parking services"
            },
            {
                title: "conference hall",
                description: "24x7 conference hall"
            },
        ]
    }, {}, {}, {}
]

module.exports = {
    sample
}