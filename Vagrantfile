# -*- mode: ruby -*-
# vi: set ft=ruby :

plugin_dependencies = [
  "vagrant-docker-compose",
  "vagrant-vbguest"
]

needsRestart = false

# Install plugins if required
plugin_dependencies.each do |plugin_name|
  unless Vagrant.has_plugin? plugin_name
    system("vagrant plugin install #{plugin_name}")
    needsRestart = true
    puts "#{plugin_name} installed"
  end
end

# Restart vagrant if new plugins were installed
if needsRestart === true
  exec "vagrant #{ARGV.join(' ')}"
end

Vagrant.configure(2) do |config|
  config.vm.define "agariovm" do |agariovm|
    agariovm.vm.hostname = "codetalk"
    agariovm.vm.box = "bento/ubuntu-16.04"
    agariovm.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true

    agariovm.vm.provider "virtualbox" do |vb|
      vb.name = "agariovm"
      vb.gui = false
      vb.memory = "2048"
      vb.cpus = 2
    end

    # Run as non-login shell, sourcing it to /etc/profile instead of /root/.profile
    # Due to clashing configurations for vagrant and base box.
    # See: https://github.com/mitchellh/vagrant/issues/1673#issuecomment-28288042
    agariovm.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

    agariovm.vm.provision "shell", inline: "apt-get update"
    agariovm.vm.provision "docker"
    agariovm.vm.provision :docker
    agariovm.vm.provision :docker_compose, compose_version: "1.15.0", project_name: "Agario", yml: ["/vagrant/docker-compose.yml"], rebuild: true, run: "always"
    agariovm.vm.provision "shell", path: "scripts/deploy_wait_message.sh", run: "always", privileged: false
  end
end
