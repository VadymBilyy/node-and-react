window.ee = new EventEmitter();
var myNews = [
	{
		author:"Vasya",
		text:"News1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis voluptatum, quos, corporis enim possimus rem.",
		bigText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum repudiandae mollitia in cupiditate repellat excepturi dignissimos consequatur qui recusandae perferendis suscipit distinctio iure fugit quia optio, quos, beatae cum placeat."
	},
	{
		author:"Petya",
		text:"News2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis voluptatum, quos, corporis enim possimus rem.",
		bigText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, atque labore ullam quibusdam, voluptas rem dolor, deserunt quis voluptates nostrum dolorem optio soluta fugit nisi ab animi necessitatibus ratione dolore."
	},
	{
		author:"Nick",
		text: "News3. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis similique architecto nostrum, corporis possimus libero.",
		bigText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex deleniti fugiat quasi omnis, suscipit temporibus dolorum tempore perferendis nam eveniet distinctio iusto aliquam cumque pariatur veritatis sunt dolore non quidem."
	}
];

var Add = React.createClass({
	getInitialState: function(){
		return {
			agreeNotChecked: true,
			authorIsEmpty: true,
			textIsEmpty: true
		};
	},

	componentDidMount: function(){
		ReactDOM.findDOMNode(this.refs.author).focus();
	},

	onBtnClickHandler: function(e){
		e.preventDefault();
		var author = ReactDOM.findDOMNode(this.refs.author).value;
		var textEl = ReactDOM.findDOMNode(this.refs.text);

		var text = textEl.value;
		
		var item = [{
			author: author,
			text: text,
			bigText: "..."
		}];
		window.ee.emit("News.add", item);
		textEl.value = "";

		this.setState({
			textIsEmpty: true
		})

	},

	onCheckRuleClick: function(e){
		//ReactDOM.findDOMNode(this.refs.alert_button).disabled = !e.target.checked;
		this.setState({
			agreeNotChecked: !this.state.agreeNotChecked
		});
	},

	/*onAuthorChange: function(e){
		if (e.target.value.trim().length > 0) {
			this.setState({
				authorIsEmpty: false
			})
		} else {
			this.setState({
				authorIsEmpty: true
			})
		}
	},
	onTextChange: function(e){
		if (e.target.value.trim().length > 0) {
			this.setState({
				textIsEmpty: false
			})
		} else {
			this.setState({
				textIsEmpty: true
			})
		}
	},*/
	onFieldChange: function(fieldName, e){
		if (e.target.value.trim().length > 0) {
			this.setState({
				["" + fieldName]: false
			})
		} else {
			this.setState({
				["" + fieldName]: true
			})
		}
	},

	render: function(){
		var agreeNotChecked = this.state.agreeNotChecked;
		var authorIsEmpty = this.state.authorIsEmpty;
		var textIsEmpty = this.state.textIsEmpty;
		return (
			<form className="add cf">
				<input 
				  type="text"
				  className="add__author"
				  defaultValue=""
				  placeholder = "Your name"
				  ref = "author"
				  onChange = {this.onFieldChange.bind(this, "authorIsEmpty")}
				/>
				<textarea
					className = "add__text"
					defaultValue = ""
					placeholder = "text"
					ref = "text"
					onChange = {this.onFieldChange.bind(this, "textIsEmpty")}
				></textarea>
				<label className = "add__checkrule">
					<input
					  onChange = {this.onCheckRuleClick} 
					  type="checkbox"
					  defaultChecked = {false}
					  ref = "checkrule"
					  /> I agree with rules
				</label>
				<button
				  className = "add__btn"
				  onClick = {this.onBtnClickHandler}
				  ref = "alert_button"
				  disabled = {agreeNotChecked || authorIsEmpty || textIsEmpty}>
				  	Add news
				  </button>
			</form>

			)
	}
});

var Article = React.createClass({
	
	propTypes: {
		data:React.PropTypes.shape({
			author:  React.PropTypes.string.isRequired,
			text:    React.PropTypes.string.isRequired,
			bigText: React.PropTypes.string.isRequired,
		})
	},

	getInitialState: function(){
		return {
			visible:false
		}
	},

	readmoreClick: function(e){
		e.preventDefault();
		this.setState({
			visible:true
		});
		//console.log(this)
	},

	render: function(){
		var author = this.props.data.author,
			text = this.props.data.text,
			bigText = this.props.data.bigText,
			visible = this.state.visible;

		return (
				<div className="news-item">
					<h4> author: <a href="#">{author}</a></h4>
					<p> {text} </p>
					
					<a href="#" 
					   onClick = {this.readmoreClick} 
					   className = {"read-more " + (visible ? "none":"")}> 
					   Read more...
					</a>
					
					<p className = {(visible ? "" : "none")}> {bigText} </p>
				</div>
			)
	}
})



var News = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},
	
	render: function(){
		var data = this.props.data;
		var newsTemplate;

		if (data.length > 0){
			 newsTemplate = data.map(function(item, index){
					return (
						<div key={index}>
							<Article data = {item} />
						</div>
						)
			});
		} else {
			newsTemplate = <h4>Sorry, no fresh news</h4>
		}
		

		return (
			<div className="news">
				{newsTemplate}
				<h4 className = {data.length > 0 ? "" : "none"}>
					Number of news: {data.length}
				</h4>
			</div>
			)
	}
});



var App =  React.createClass({
	getInitialState: function(){
		return ({
			news: myNews
		})
	},
	componentDidMount: function(){
		var self = this;

		window.ee.addListener("News.add", function(item){
			var nextNews = item.concat(self.state.news);
			self.setState({
				news: nextNews
			})
		})
	},

	componentWillUnmount: function(){
		window.ee.removeListener("News.add")
	},

	render: function(){
		return (
				<div className="app">
					<Add />
					<h2>Latest news!</h2>
					<News data = {this.state.news}/>
				</div>
			);
	}
});


ReactDOM.render(
	<App/>,
	document.getElementById("root")
	); 


