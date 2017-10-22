# ============== Maven Build ===============

# Since node binary isn't compatible with Alpine
# https://github.com/eirslett/frontend-maven-plugin/issues/633
FROM maven:3.5-jdk-8-slim as builder
LABEL maintainer Jaskaranbir Dhillon

WORKDIR /opt/maven

# Docker Cachebust
ADD https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new uuid

COPY pom.xml package.json ./
COPY src ./src
COPY config ./config

RUN ["mvn", "clean", "install"]

# =========== Tomcat Deployment =============
FROM tomcat:8.5.23-jre8-alpine
LABEL maintainer Jaskaranbir Dhillon

COPY --from=builder /opt/maven/target/* /target/

COPY scripts/run-maven_tomcat.sh /
RUN chmod +x /run-maven_tomcat.sh

CMD ["/run-maven_tomcat.sh"]