/**
	CSSAnimations [class]
		- A class to generate and execute CSS Animations
		- Only tested in Safari 5, iPad and iPhone
*/
Fx.Animation = new Class({
	Implements:[Options,Events],

	options:{
		duration:1000,
		iteration:1,
		easing:'linear'
		/*
			Keyframe API:
			keyframes:{
				precentage(number as string):properties(string),
				precentage(number as string):properties(string)
			}

			Events:
			onStart:(function),
			onIterate:(function), // Not implemented
			onComplete:(function),
			onCancel:(function)
		*/
	},

	animating:false,

	initialize:function(name,options){
		this.setOptions(options);

		this.name = name;

		if($type(this.options.duration)==='number')
			this.options.duration+='ms';

		return this;
	},

	animationString:function(forceGenerate){
		if(!this.options.animationString || forceGenerate===true){
			this.options.animationString = ''+this.name;
			this.options.animationString += ' '+this.options.duration;
			this.options.animationString += ' '+this.options.iteration;
			this.options.animationString += ' '+((this.options.easing) ? this.options.easing : 'linear');
		}

		return this.options.animationString;
	},

	keyframes:function(forceGenerate){
		if(!this.options.keyframeString || forceGenerate===true) {
			this.options.keyframeString = '@-webkit-keyframes '+this.name+' {';

			$each(this.options.keyframes,function(obj,index){
				this.options.keyframeString+=index+'% {';

				$each(obj,function(value,key){
					this.options.keyframeString+=key+':'+value+';';
				},this);

				this.options.keyframeString+='}';
			},this);

			this.options.keyframeString+='}';
		}

		return this.options.keyframeString;
	}
});

Fx.Animations = new Class({
	Implements:Options,

	options:{
		chain:'ignore'
	},


	Animations:{},

	animationStatus:{
		running:false,
		name:null
	},

	initialize:function(el){
		// Add Webkit Animation Events
		(function(){
			if(Element.NativeEvents.animationEnd) return;

			Element.NativeEvents.animationEnd = 2;
			Element.NativeEvents.webkitAnimationEnd = 2;
			Element.NativeEvents.webkitAnimationStart = 2;

			Element.Events.set('animationEnd', { base:'webkitAnimationEnd' });
			Element.Events.set('animationStart', { base:'webkitAnimationStart' });
		}).apply(window);

		// Add new stylesheet for keyframe rules
		new Element('style',{ type:'text/css' }).inject($$('head')[0]);

		this.stylesheet = document.styleSheets[document.styleSheets.length-1];

		// Prebind all major events.
		this.addAnimation = this.addAnimation.bind(this);
		this.removeAnimation = this.removeAnimation.bind(this);
		this.start = this.start.bind(this);
		this.cancel = this.cancel.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.addEvents = this.addEvents.bind(this);
		this.removeEvent = this.removeEvent.bind(this);
		this.removeEvents = this.removeEvents.bind(this);
		this.animationStart = this.animationStart.bindWithEvent(this);
		this.animationEnd = this.animationEnd.bindWithEvent(this);

		this.el = $(el).addEvents({

			animationStart:this.animationStart,

			animationEnd:this.animationEnd
		});

		return this;
	},

	start:function(animation){
		if(!this.Animations[animation]) return false;

		this.el.setStyle('webkitAnimation',this.Animations[animation].animationString());

		return this;
	},

	cancel:function(){
		if(this.animationStatus.running===false) return this;

		this.animationStatus.running = false;

		this.el.setStyle('webkitAnimation','');

		return this;
	},

	animationStart:function(event){
		this.animationStatus.running = true;

		this.animationStatus.name = event.event.animationName;

		return this.Animations[event.event.animationName].fireEvent('start',event);
	},
	/*
	Have to Implement and  perform further testing
	animIteration:function(){

	},
	*/
	animationEnd:function(event){
		this.animationStatus.running = false;

		return this.Animations[event.event.animationName].fireEvent('complete',event);
	},

	addEvent:function(anim,type,func){
		if(!this.Animations[anim]) return false;

		this.Animations[anim].addEvent(type,func);

		return this;
	},

	addEvents:function(anim,obj){
		if(!this.Animations[anim]) return false;

		this.Animations[anim].addEvents(obj);

		return this;
	},

	removeEvent:function(anim,type,func){
		if(!this.Animations[anim]) return false;

		this.Animations[anim].removeEvent(type,func);

		return this;
	},

	removeEvents:function(anim,obj){
		if(!this.Animations[anim]) return false;

		this.Animations[anim].removeEvents(obj);

		return this;
	},

	addAnimation:function(name,anim){
		if(this.Animations[name]) return false;

		anim.ruleIndex = this.stylesheet.cssRules.length;

		this.Animations[name] = new Fx.Animation(name,anim);

		this.stylesheet.insertRule(this.Animations[name].keyframes(),anim.ruleIndex);

		return this;
	},

	removeAnimation:function(anim){
		if(!this.Animations[anim]) return false;

		this.Animations[anim].removeEvents();

		this.stylesheet.deleteRule(this.Animations[anim].options.ruleIndex);

		delete this.Animations[anim];

		return this;
	}
});

