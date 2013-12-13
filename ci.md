#CI 速学笔记

## 控制器

简而言之：控制器就是一个类文件，是以一种能够和URI关联在一起的方式来命名的。

	example.com/index.php/blog/

上面这个例子中，CodeIgniter将尝试寻找并装载一个名为blog.php的控制器。
当控制器的名字匹配URI的第一段时，它将被装载。

让我们试试看：
	
	<?php
	class Blog extends CI_Controller{

		function __construct(){
			parent::__construct();
		}

		public function index(){
			echo 'hello world!';
		}

	}

保存文件到application/controllers/文件夹中、

## 方法：

	example.com/index.php/blog/index/

URI的第二部分是用来决定调用控制器中哪个方法的。

	<?php
	class Blog extends CI_Controller{

		function __construct(){
			parent::__construct();
		}

		public function index(){
			echo 'hello world!';
		}

		public function comments(){
			echo '看这里';
		}

	}

## 传递参数：

如果URI超过两个部分，那么超过的部分将呗作为参数传递给方法。

	example.com/index.php/products/shoes/sandals/123

	<?php
	class Products extends CI_Controller {

		public function shoes($sandals, $id){
			echo $sandals;
			echo $id;
		}
	}
	?>

上面的方法调用时必须给两个相应的参数，不然会出错，当然可以这样写。就不用在调用的时候给参数了


	<?php
	class Products extends CI_Controller {

		public function shoes($sandals='Test', $id=1){
			echo $sandals;
			echo $id;
		}
	}
	?>


## 定义默认控制器

当你的网站不存在某个uri或者用户从根目录访问的时候，ci会加载默认控制器。可以在application/config/routers.php 文件设置默认控制器：

	$route['default_controller'] = 'Blog';

这里的Blog就是你希望使用的控制器的名字。如果此时你不指定任何uri片段来访问就看到'hello world'的信息。

## 重新定义方法的调用规则

uri的第二个片段会决定调用控制器中的哪个方法。ci允许你使用_remap()方法来废除这种规则：

	public function _remap($method){
		if($method == 'some_method'){
			$this->$method();
		}else{
			$this->comments();
		}
	}


## 处理输出

ci 拥有一个输出类来确保你修改的数据会自动被传递给浏览器。关于这个的更多信息可以在视图和输出类里找到。有些时候，你可能想要自己发布修改该一些最终的数据或是把它传递给浏览器。ci允许你给你的控制器增加一个名为 _output()的方法来接受最终数据。





# 模型

## 什么模型

模型是专门用来和数据库打交道的 PHP类，例如，加入你想用ci来做一个blog，你可以写一个模型类，里面包含插入，更新，删除blog数据的方法。下面的例子将向你展示一个普通的模型类：

class Blogmodel extends CI_Model{
	var $title = '';
	var $content = '';
	var $date = '';

	function __construct(){
		parent::__construct();
	}

	#查询
	function get_last_ten_entries(){
		$query = $this->db->get('entries', 10);
		return $query->result();
	}

	#插入
	function insert_entry(){
		$this->title = $_POST['title'];
		$this->content = $_POST['content'];
		$this->date = time();

		$this->db->insert('entries', $this);
	}

	#更新
	function update_entry(){
		$this->title = $_POST['title'];
		$this->content = $_POST['content'];
		$this->date = time();

		$this->db->update('entries', $this, array('id'=> $_POST['id']));
	}

}

* 注意：为了简单一点，我们直接使用了$_POST，不过这不太好，平时我们应该使用输入类：$this->input->post('title');

模型类文件存放在application/models/文件夹。如果你愿意，可以在里面建立子文件夹。

class Model_name extends CI_Model{
	function __construct(){
		parent::__construct();
	}
}

Model_name 是模型类的名字。类名的首字母必须大写，其他字母小写。并且确保你的类继承了基本模型类(Base Model Class)。
文件名应该是模型类名的小写版。比如，如果你的类是：

	application/models/user_model.php


