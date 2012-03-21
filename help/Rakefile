require 'rubygems'
require 'rake'
require 'open-uri'
require 'multi_json'
require 'awesome_print'
require 'hashie'
require 'date'

class Post < Hashie::Mash
  def date
    d=Date._strptime(self['date'],"%m月 %d, %Y %H:%M")
    Time.utc(d[:year], d[:mon], d[:mday], d[:hour], d[:min], 
         d[:sec], d[:sec_fraction], d[:zone])
  end
  
  def filename
    "_posts/#{date.strftime('%Y-%m-%d')}-#{slug}.html"
  end
  
  def slug
    self["permalink"].split('/').last
  end
  
  def body
    self.content
  end
end

task :pull do
  posts = MultiJson.decode(open("http://blog.ossxp.com/feed/?feed=json").read).map{|p| Post.new(p) }
  
  posts.each do |p|
    if File.exists?(p.filename)
      puts "- Blog post at #{p.filename} exists, ignoring"
    else
      puts "- Creating blog post at #{p.filename}"
      File.open(p.filename,'w') do |f|
        f.write <<-YAML
---
layout: post
title: "#{p.title}"
---

#{p.body}
YAML
      end
    end
  end
end
