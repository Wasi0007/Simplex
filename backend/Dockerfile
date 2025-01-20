# Stage 1: Build the application
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests  # Build JAR without running tests

# Stage 2: Run the application
FROM amazoncorretto:17
ARG PROFILE=prod

WORKDIR /app
COPY --from=build /build/target/simpex-backend.jar /app/

EXPOSE 8081

# Set runtime environment variables
ENV SPRING_PROFILES_ACTIVE=${PROFILE}
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/simpex?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "/app/simpex-backend.jar"]
