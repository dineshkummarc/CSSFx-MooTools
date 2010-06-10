var Cube = new Class({

	faces:[],

	initialize:function(){
		this.body = $(document.body);
		this.window = $(window);

		this.getSize();

		this.template = new Element('div',{
			'class':'Template cube',
			styles:{
				width:this.windowInfo.x,
				height:this.windowInfo.y,
				webkitTransform:'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(0)'
			}
		}).inject(this.body);

		this.faces[0] = this.createFace('one');
		this.faces[1] = this.createFace('two');
		this.faces[2] = this.createFace('three');
		this.faces[3] = this.createFace('four');

		this.animation = new CSSAnimations(this.template);
		
		
		this.animation.addAnimation({
			name:'rotateOne',
			duration:'1000ms',
			easing:'ease-in-out',
			iteration:1,
			onComplete:(function(){
				this.template.setStyle('webkitTransform','translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-90deg)');
			}).bind(this),
			keyframes:{
				'0':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(0deg)' },
				'25':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(0deg)' },
				'75':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-90deg)' },
				'100':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-90deg)' }
			}
		});
		
		this.animation.addAnimation({
			name:'rotateTwo',
			duration:'1000ms',
			easing:'ease-in-out',
			iteration:1,
			onComplete:(function(){
				this.template.setStyle('webkitTransform','translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-180deg)');
			}).bind(this),
			keyframes:{
				'0':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-90deg)' },
				'25':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-90deg)' },
				'75':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-180deg)' },
				'100':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-180deg)' }
			}
		});
		
		this.animation.addAnimation({
			name:'rotateThree',
			duration:'1000ms',
			easing:'ease-in-out',
			iteration:1,
			onComplete:(function(){
				this.template.setStyle('webkitTransform','translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-270deg)');
			}).bind(this),
			keyframes:{
				'0':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-180deg)' },
				'25':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-180deg)' },
				'75':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-270deg)' },
				'100':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-270deg)' }
			}
		});
		
		this.animation.addAnimation({
			name:'rotateFour',
			duration:'1000ms',
			easing:'ease-in-out',
			iteration:1,
			onComplete:(function(){
				this.template.setStyle('webkitTransform','translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(0deg)');
			}).bind(this),
			keyframes:{
				'0':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-270deg)' },
				'25':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-270deg)' },
				'75':{ '-webkit-transform':'translate3d(0,0,'+-(this.windowInfo.halfX+500)+'px) rotateY(-360deg)' },
				'100':{ '-webkit-transform':'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(-360deg)' }
			}
		});
	},

	createFace:function(num){
		return new Element('div',{
			'class':'face '+num,
			text:'This is face '+num,
			styles:{
				width:this.windowInfo.x,
				height:this.windowInfo.y,
				webkitTransformOrigin:'50% 50% 0',
				webkitTransform:this.determineTransforms(num)
			},
			events:{
				click:this.changeFace.bindWithEvent(this,num)
			}
		}).inject(this.template);
	},

	determineTransforms:function(num){
		var transforms = '';

		switch(num){
			case 'one':
				transforms = 'translate3d(0,0,'+this.windowInfo.halfX+'px) rotateY(0deg)';
				break;
			case 'two':
				transforms = 'translate3d('+this.windowInfo.halfX+'px,0,0) rotateY(90deg)';
				break;
			case 'three':
				transforms = 'translate3d(0,0,'+-this.windowInfo.halfX+'px) rotateY(180deg)';
				break;
			case 'four':
				transforms = 'translate3d('+-this.windowInfo.halfX+'px,0,0) rotateY(270deg)';
				break;
		};

		return transforms;
	},

	getSize:function(){
		this.windowInfo = {};

		this.windowInfo = this.window.getSize();

		this.windowInfo.halfX = this.windowInfo.x/2;
		this.windowInfo.halfY = this.windowInfo.y/2;
	},

	changeFace:function(e,val){
		if(e && e.stop) e.stop();
		//console.log(this.template);
		if(val==='one')
			this.animation.start('rotateOne');
		if(val==='two')
			this.animation.start('rotateTwo');
		if(val==='three') 
			this.animation.start('rotateThree');
		if(val==='four') 
			this.animation.start('rotateFour');
	},

	getAnim:function()
	{
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; ++i) {
			for (var j = 0; j < ss[i].cssRules.length; ++j) {
				if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == 'rotate')
					return ss[i].cssRules[j];
			}
		}
		return null;
	}
});

var CSSAnimations = new Class({
	Implements:Options,
	options:{},
	initialize:function(el){
		(function(){
			if(Element.NativeEvents.animationEnd) return;
			Element.NativeEvents.animationEnd = 2;
			Element.NativeEvents.webkitAnimationEnd = 2;
			Element.NativeEvents.webkitAnimationStart = 2;

			Element.Events.set('animationEnd', { base:'webkitAnimationEnd' });
			Element.Events.set('animationStart', { base:'webkitAnimationStart' });
		}).apply(window);

		this.body = $(document.body);
		this.addAnimation = this.addAnimation.bind(this);
		this.removeAnimation = this.removeAnimation.bind(this);
		this.start = this.start.bind(this);
		this.animationStart = this.animationStart.bindWithEvent(this);
		this.animationEnd = this.animationEnd.bindWithEvent(this);

		this.el = $(el).addEvents({
			animationStart:this.animationStart,
			animationEnd:this.animationEnd
		});


	},

	start:function(animation){
		this.el.setStyle('webkitAnimation',this.Animations[animation].shortcut);
	},

	animationStart:function(event){
		console.log(event);
	},
	/*
	animIteration:function(){

	},*/

	animationEnd:function(event){
		console.log('endEvent:');
		console.log(event);
		if(this.Animations[event.event.animationName].onComplete)
			this.Animations[event.event.animationName].onComplete();
		//this.el.setStyle('webkitAnimation','');
	},

	Animations:{},

	addAnimation:function(anim){
		/*{
			name:(string),
			duration:(string),
			iteration:(string),
			keyframes:{
				precentage(string):properties(string),
				precentage(string):properties(string)
			},
			easing:(string),
			onStart:(function),
			onIterate:(function),
			onComplete:(function)
		}*/

		var name = anim.name;
		if(this.Animations[name]) return false;
		delete anim.name;

		this.Animations[name] = $merge(anim);

		var animationString = '@-webkit-keyframes '+name+' {';

		$each(this.Animations[name].keyframes,function(obj,index){
			animationString+=index+'%{';
			$each(obj,function(value,key){
				animationString+=key+':'+value+';';
			},this);
			animationString+='}';
		},this);

		animationString+='}';

		this.Animations[name].string = animationString;

		this.Animations[name].shortcut = '';

		this.Animations[name].shortcut += name;
		this.Animations[name].shortcut += ' '+this.Animations[name].duration;
		this.Animations[name].shortcut += ' '+this.Animations[name].iteration;
		this.Animations[name].shortcut += ' '+this.Animations[name].easing;

		this.Animations[name].stylesheet = new Element('style',{
			type:'text/css',
			html:this.Animations[name].string
		}).inject($$('head')[0]);

	},

	removeAnimation:function(key){
		if(!this.Animations[key]) return false;

		this.Animations[key].stylesheet.destroy();
		delete this.Animations[key];

		return true;
	}
});