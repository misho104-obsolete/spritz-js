#!/usr/local/bin/ruby
require 'yomu'
text = Yomu.new(File.expand_path(ARGV[0])).text

skip = false
File.open("yomu.html","w") do |file|
  File.open("demo.html").each do |paragraph|
    if begin_tag = paragraph.match(/\A(.*<textarea ([^>]* )?id="text".*?>)/)
      file.write(begin_tag)
      file.write(text)
      skip = true
    end
    if skip
      if end_tag = paragraph.match(/<\/textarea>(.*)\z/)
        file.write(end_tag)
        skip = false
      end
    else
      file.write(paragraph)
    end
  end
end
system("browser yomu.html")
