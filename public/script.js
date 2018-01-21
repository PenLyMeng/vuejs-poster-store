 


var app = new Vue({

    el:'#app',
    data:{
        notFound:false,
        messageSearch:"",
        defaultMessageSearch:"fk",
        total:0,
        items:[],
        cart:[],
        lastSearch:'',
        price:9.5,
        results:[],
        searching:false,
      
    },
    methods:{
        appendItems:function(){
            if(this.items.length < this.results.length ){
                    var data =  this.results
                    this.items = this.items.concat(data.slice(this.items.length,this.items.length+10))
                   
            }
            console.log(this.items.length +" " + this.results.length);  
        },
        onSearch:function(){

            if(this.messageSearch === ''){
                return 
            }
           this.searching = true
            this.$http.get('/search/'.concat(this.messageSearch)).then(function(response){
                this.results = response.data 
                this.items = response.data.slice(0,10)
                this.lastSearch = this.messageSearch
                if(this.items.length > 0){
                    this.notFound = true
                }
                this.searching = false
                
            },
            function(error){
                this.searching = false
            }
            )},

        deductQty:function(index){
            this.total -= this.price
            if(this.cart[index].orderQty == 1){
                 this.cart.splice(index,1)
            }else{
                this.cart[index].orderQty -= 1 
            }          
        },
        addQty:function(index){
            this.cart[index].orderQty += 1 
            this.total += this.price
      
        },
        
        addItem:function(index){
        
            this.total += this.price
            var item = this.items[index]
            var added = false;
            this.cart.forEach(element => {
                if(element.id == item.id){
                    element.orderQty += 1
                    added = true
                }
            });

            if(!added){
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: this.price,
                    orderQty: 1,
                }); 
            }
        },
         
    },

    filters:{
        currency:function(price){
            return '$'.concat(price.toFixed(2))
        }
    },
    
    computed:{
        isLoadAll:function(){
            if(this.items.length === this.results.length && this.results.length > 0){
                return true
            }else{
                return false
            }
        }
    },

    created:function(){
        this.searching = true
        this.$http.get('/search/'.concat(this.defaultMessageSearch)).then(function(response){
            this.results = response.data 
            this.items = response.data.slice(0,10); 
            this.lastSearch = this.messageSearch
            if(this.items.length > 0){
                this.notFound = true
            }
            this.searching = false
            
        },
        function(error){
            this.searching = false
        }
        )
    },

    mounted:function(){
        var vueInstance = this

        var elem = document.getElementById('product-list-bottom')
 
        var watcher = scrollMonitor.create(elem)
        watcher.enterViewport(function(){
            vueInstance.appendItems()
        });
    },

});


 
 